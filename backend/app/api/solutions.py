from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.db import get_db
from app.models import Problem, ProblemAssignment, ProblemStatusHistory, Solution, ResearchProject, FeasibilityAssessment, User, Organization, Notification
from app.schemas import SolutionCreate, ResearchProjectCreate, FeasibilityAssessmentCreate, ProblemResponse
from app.api.auth import get_current_user

router = APIRouter(prefix="/solutions", tags=["Solutions & Dashboard Actions"])

@router.get("/organization-assigned", response_model=List[ProblemResponse])
async def get_org_assigned_problems(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if not current_user.organization_id:
        # Fallback for demo users without explicit org ID: return all assigned/accepted problems
        query = select(Problem).where(
            Problem.status.in_(["ASSIGNED", "ACCEPTED", "RESEARCH", "FEASIBILITY", "SOLUTION_PROPOSED", "PILOT", "IMPLEMENTATION", "VERIFICATION", "RESOLVED"])
        ).options(
            selectinload(Problem.images),
            selectinload(Problem.assignments).selectinload(ProblemAssignment.organization),
            selectinload(Problem.milestones),
            selectinload(Problem.solutions)
        ).order_by(Problem.updated_at.desc())
    else:
        # Find problems assigned to this user's organization
        query = select(Problem).join(ProblemAssignment).where(
            ProblemAssignment.organization_id == current_user.organization_id
        ).options(
            selectinload(Problem.images),
            selectinload(Problem.assignments).selectinload(ProblemAssignment.organization),
            selectinload(Problem.milestones),
            selectinload(Problem.solutions)
        ).order_by(Problem.updated_at.desc())

    res = await db.execute(query)
    return res.scalars().all()

@router.post("/problems/{problem_id}/accept")
async def accept_problem_assignment(
    problem_id: str,
    notes: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res_p = await db.execute(select(Problem).where(Problem.id == problem_id))
    problem = res_p.scalars().first()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")

    old_status = problem.status
    new_status = "ACCEPTED"
    if current_user.role == "UNIVERSITY":
        new_status = "RESEARCH"
    elif current_user.role == "INDUSTRY":
        new_status = "FEASIBILITY"
    elif current_user.role == "GOVERNMENT":
        new_status = "IMPLEMENTATION"

    problem.status = new_status
    db.add(ProblemStatusHistory(
        problem_id=problem.id,
        from_status=old_status,
        to_status=new_status,
        changed_by_user_id=current_user.id,
        notes=notes or f"Accepted by {current_user.role} ({current_user.full_name})"
    ))

    # Notify Citizen
    db.add(Notification(
        user_id=problem.citizen_id,
        title=f"Problem Accepted by {current_user.role}",
        message=f"Work has started on '{problem.title}'. Status updated to {new_status}.",
        type="INFO",
        link=f"/problems/{problem.id}"
    ))

    await db.commit()
    return {"message": "Problem accepted successfully", "status": new_status}

@router.post("/problems/{problem_id}/propose-solution")
async def propose_solution(
    problem_id: str,
    solution_in: SolutionCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res_p = await db.execute(select(Problem).where(Problem.id == problem_id))
    problem = res_p.scalars().first()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")

    org_id = current_user.organization_id or "default-org-id"
    solution = Solution(
        problem_id=problem.id,
        title=solution_in.title,
        description=solution_in.description,
        created_by_org_id=org_id,
        solution_type=solution_in.solution_type,
        cost_estimate=solution_in.cost_estimate,
        implementation_time=solution_in.implementation_time
    )
    db.add(solution)

    old_status = problem.status
    problem.status = "SOLUTION_PROPOSED"
    db.add(ProblemStatusHistory(
        problem_id=problem.id,
        from_status=old_status,
        to_status="SOLUTION_PROPOSED",
        changed_by_user_id=current_user.id,
        notes=f"Solution proposed: {solution_in.title}"
    ))

    await db.commit()
    return {"message": "Solution proposed successfully", "solution_id": solution.id}

@router.post("/problems/{problem_id}/research-project")
async def create_research_project(
    problem_id: str,
    rp_in: ResearchProjectCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    rp = ResearchProject(
        problem_id=problem_id,
        university_org_id=current_user.organization_id or "default-uni-id",
        title=rp_in.title,
        scope=rp_in.scope,
        faculty_mentor=rp_in.faculty_mentor,
        student_team=rp_in.student_team,
        prototype_url=rp_in.prototype_url
    )
    db.add(rp)
    
    res_p = await db.execute(select(Problem).where(Problem.id == problem_id))
    problem = res_p.scalars().first()
    if problem:
        problem.status = "RESEARCH"
        db.add(ProblemStatusHistory(
            problem_id=problem.id,
            from_status=problem.status,
            to_status="RESEARCH",
            changed_by_user_id=current_user.id,
            notes=f"University research project initiated: {rp_in.title}"
        ))

    await db.commit()
    return {"message": "Research project created", "id": rp.id}

@router.post("/problems/{problem_id}/feasibility")
async def create_feasibility_assessment(
    problem_id: str,
    fa_in: FeasibilityAssessmentCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    fa = FeasibilityAssessment(
        problem_id=problem_id,
        industry_org_id=current_user.organization_id or "default-ind-id",
        technical_feasibility=fa_in.technical_feasibility,
        economic_feasibility=fa_in.economic_feasibility,
        estimated_cost=fa_in.estimated_cost,
        estimated_timeline=fa_in.estimated_timeline,
        mentorship_details=fa_in.mentorship_details
    )
    db.add(fa)

    res_p = await db.execute(select(Problem).where(Problem.id == problem_id))
    problem = res_p.scalars().first()
    if problem:
        problem.status = "FEASIBILITY"
        db.add(ProblemStatusHistory(
            problem_id=problem.id,
            from_status=problem.status,
            to_status="FEASIBILITY",
            changed_by_user_id=current_user.id,
            notes="Industry technical & economic feasibility submitted"
        ))

    await db.commit()
    return {"message": "Feasibility assessment saved", "id": fa.id}
