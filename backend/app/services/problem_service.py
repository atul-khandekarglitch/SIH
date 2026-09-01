import json
from datetime import datetime
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import desc

from app.models import Problem, ProblemImage, ProblemStatusHistory, ProblemEmbedding, ProblemAssignment, Organization, Notification
from app.schemas import ProblemCreate, AIAnalysisResult
from app.ai.llm_service import analyze_problem_with_llm
from app.ai.embedding_service import get_embedding, cosine_similarity

async def create_new_problem(db: AsyncSession, problem_in: ProblemCreate, citizen_id: str) -> Problem:
    # 1. Create problem record
    problem = Problem(
        title=problem_in.title,
        description=problem_in.description,
        category=problem_in.category,
        subcategory=problem_in.subcategory,
        location_lat=problem_in.location_lat,
        location_lng=problem_in.location_lng,
        address=problem_in.address,
        district=problem_in.district or "Ranchi",
        additional_info=problem_in.additional_info,
        status="AI_PROCESSING",
        citizen_id=citizen_id
    )
    db.add(problem)
    await db.flush()

    # 2. Add images if any
    if problem_in.images:
        for img_url in problem_in.images:
            db.add(ProblemImage(problem_id=problem.id, image_url=img_url))

    # 3. Log status history
    db.add(ProblemStatusHistory(
        problem_id=problem.id,
        from_status=None,
        to_status="REPORTED",
        notes="Problem submitted by citizen"
    ))
    db.add(ProblemStatusHistory(
        problem_id=problem.id,
        from_status="REPORTED",
        to_status="AI_PROCESSING",
        notes="Triggered automated AI analysis pipeline"
    ))

    await db.commit()
    await db.refresh(problem)

    # 4. Trigger AI analysis & embedding asynchronously or inline
    await run_ai_analysis_pipeline(db, problem.id)
    await db.refresh(problem)
    return problem

async def run_ai_analysis_pipeline(db: AsyncSession, problem_id: str) -> Problem:
    res = await db.execute(select(Problem).where(Problem.id == problem_id))
    problem = res.scalars().first()
    if not problem:
        return None

    try:
        # Run LLM analysis
        analysis: AIAnalysisResult = await analyze_problem_with_llm(
            title=problem.title,
            description=problem.description,
            category_input=problem.category,
            district=problem.district
        )

        problem.category = analysis.category
        problem.subcategory = analysis.subcategory
        problem.severity = analysis.severity_score
        problem.urgency = analysis.urgency_score
        problem.public_impact = analysis.public_impact_score
        problem.ai_summary = analysis.summary
        problem.confidence_score = analysis.confidence_score
        problem.reasoning = analysis.reasoning
        problem.required_expertise = analysis.required_expertise
        problem.recommended_route = analysis.recommended_route
        problem.status = "ROUTING_RECOMMENDED"

        # Generate & save vector embedding
        embed_text = f"{problem.title} {problem.description} {problem.category} {problem.district}"
        vector = await get_embedding(embed_text)
        
        # Save vector embedding record
        embedding_rec = ProblemEmbedding(problem_id=problem.id, embedding_json=vector)
        db.add(embedding_rec)

        # Log status transition
        db.add(ProblemStatusHistory(
            problem_id=problem.id,
            from_status="AI_PROCESSING",
            to_status="ROUTING_RECOMMENDED",
            notes=f"AI processing complete. Route recommended: {analysis.recommended_route}"
        ))

    except Exception as e:
        print(f"[AI Pipeline Error] {e}")
        problem.status = "AI_ANALYZED"
        db.add(ProblemStatusHistory(
            problem_id=problem.id,
            from_status="AI_PROCESSING",
            to_status="AI_ANALYZED",
            notes=f"AI processing fallback completed: {str(e)}"
        ))

    await db.commit()
    await db.refresh(problem)
    return problem

async def find_similar_problems(db: AsyncSession, problem_id: str, limit: int = 5):
    # Fetch target embedding
    res_embed = await db.execute(select(ProblemEmbedding).where(ProblemEmbedding.problem_id == problem_id))
    target_rec = res_embed.scalars().first()
    
    res_all_embeds = await db.execute(select(ProblemEmbedding).where(ProblemEmbedding.problem_id != problem_id))
    all_rec = res_all_embeds.scalars().all()

    if not target_rec or not all_rec:
        return []

    vec_target = target_rec.embedding_json
    results = []

    for item in all_rec:
        sim = cosine_similarity(vec_target, item.embedding_json)
        if sim > 0.35: # Threshold for similarity consideration
            res_p = await db.execute(select(Problem).where(Problem.id == item.problem_id))
            p = res_p.scalars().first()
            if p:
                results.append({
                    "id": p.id,
                    "title": p.title,
                    "category": p.category,
                    "district": p.district,
                    "similarity_score": round(sim * 100, 1),
                    "is_possible_duplicate": sim > 0.70,
                    "status": p.status,
                    "created_at": p.created_at
                })

    results.sort(key=lambda x: x["similarity_score"], reverse=True)
    return results[:limit]
