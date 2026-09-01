from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.db import get_db
from app.models import Problem, Feedback, ProblemStatusHistory, User
from app.schemas import FeedbackCreate
from app.api.auth import get_current_user

router = APIRouter(prefix="/feedback", tags=["Feedback"])

@router.post("/problems/{problem_id}")
async def submit_citizen_feedback(
    problem_id: str,
    fb_in: FeedbackCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res_p = await db.execute(select(Problem).where(Problem.id == problem_id))
    problem = res_p.scalars().first()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")

    feedback = Feedback(
        problem_id=problem.id,
        citizen_id=current_user.id,
        rating=fb_in.rating,
        comments=fb_in.comments,
        is_satisfied=fb_in.is_satisfied,
        requested_reopen=fb_in.requested_reopen
    )
    db.add(feedback)

    old_status = problem.status
    if fb_in.requested_reopen:
        problem.status = "IMPLEMENTATION"
        db.add(ProblemStatusHistory(
            problem_id=problem.id,
            from_status=old_status,
            to_status="IMPLEMENTATION",
            changed_by_user_id=current_user.id,
            notes=f"Citizen requested reopening. Rating: {fb_in.rating}/5. Comment: {fb_in.comments}"
        ))
    else:
        problem.status = "RESOLVED"
        db.add(ProblemStatusHistory(
            problem_id=problem.id,
            from_status=old_status,
            to_status="RESOLVED",
            changed_by_user_id=current_user.id,
            notes=f"Citizen confirmed resolution. Rating: {fb_in.rating}/5. Comment: {fb_in.comments}"
        ))

    await db.commit()
    return {"message": "Feedback submitted successfully", "status": problem.status}
