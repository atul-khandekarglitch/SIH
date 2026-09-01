import os
import shutil
import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.db import get_db
from app.models import Problem, ProblemImage, ProblemAssignment, ProblemStatusHistory, Milestone, Solution, User, Organization
from app.schemas import ProblemCreate, ProblemResponse, SimilarProblemResponse
from app.api.auth import get_current_user
from app.services.problem_service import create_new_problem, run_ai_analysis_pipeline, find_similar_problems

router = APIRouter(prefix="/problems", tags=["Problems"])

UPLOAD_DIR = os.path.join(os.getcwd(), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("", response_model=ProblemResponse)
async def create_problem(
    problem_in: ProblemCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    problem = await create_new_problem(db, problem_in, current_user.id)
    return await get_problem_by_id(problem.id, db)

@router.get("", response_model=List[ProblemResponse])
async def list_problems(
    category: Optional[str] = None,
    district: Optional[str] = None,
    status: Optional[str] = None,
    limit: int = 50,
    db: AsyncSession = Depends(get_db)
):
    query = select(Problem).options(
        selectinload(Problem.images),
        selectinload(Problem.assignments).selectinload(ProblemAssignment.organization),
        selectinload(Problem.milestones),
        selectinload(Problem.solutions)
    ).order_by(Problem.created_at.desc())

    if category:
        query = query.where(Problem.category == category)
    if district:
        query = query.where(Problem.district == district)
    if status:
        query = query.where(Problem.status == status)

    query = query.limit(limit)
    res = await db.execute(query)
    problems = res.scalars().all()
    return problems

@router.get("/my", response_model=List[ProblemResponse])
async def list_my_problems(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    query = select(Problem).where(Problem.citizen_id == current_user.id).options(
        selectinload(Problem.images),
        selectinload(Problem.assignments).selectinload(ProblemAssignment.organization),
        selectinload(Problem.milestones),
        selectinload(Problem.solutions)
    ).order_by(Problem.created_at.desc())

    res = await db.execute(query)
    return res.scalars().all()

@router.get("/{problem_id}", response_model=ProblemResponse)
async def get_problem_by_id(problem_id: str, db: AsyncSession = Depends(get_db)):
    query = select(Problem).where(Problem.id == problem_id).options(
        selectinload(Problem.images),
        selectinload(Problem.assignments).selectinload(ProblemAssignment.organization),
        selectinload(Problem.milestones),
        selectinload(Problem.solutions)
    )
    res = await db.execute(query)
    problem = res.scalars().first()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    return problem

@router.post("/{problem_id}/analyze", response_model=ProblemResponse)
async def trigger_ai_analysis(problem_id: str, db: AsyncSession = Depends(get_db)):
    updated_problem = await run_ai_analysis_pipeline(db, problem_id)
    if not updated_problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    return await get_problem_by_id(problem_id, db)

@router.get("/{problem_id}/similar")
async def get_similar_problems_endpoint(problem_id: str, db: AsyncSession = Depends(get_db)):
    similar = await find_similar_problems(db, problem_id)
    return similar

@router.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    ext = os.path.splitext(file.filename)[1] or ".jpg"
    file_id = f"{uuid.uuid4()}{ext}"
    file_path = os.path.join(UPLOAD_DIR, file_id)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {"image_url": f"/uploads/{file_id}"}
