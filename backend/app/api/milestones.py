from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.db import get_db
from app.models import Problem, Milestone, ProblemStatusHistory, User, Notification
from app.schemas import MilestoneCreate, MilestoneUpdate
from app.api.auth import get_current_user

router = APIRouter(prefix="/milestones", tags=["Milestones"])

@router.post("/problems/{problem_id}")
async def create_milestone(
    problem_id: str,
    ms_in: MilestoneCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res_p = await db.execute(select(Problem).where(Problem.id == problem_id))
    problem = res_p.scalars().first()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")

    milestone = Milestone(
        problem_id=problem.id,
        organization_id=current_user.organization_id,
        title=ms_in.title,
        description=ms_in.description,
        target_date=ms_in.target_date,
        status="PENDING"
    )
    db.add(milestone)
    await db.commit()
    await db.refresh(milestone)
    return milestone

@router.patch("/{milestone_id}")
async def update_milestone_status(
    milestone_id: str,
    ms_up: MilestoneUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(Milestone).where(Milestone.id == milestone_id))
    milestone = res.scalars().first()
    if not milestone:
        raise HTTPException(status_code=404, detail="Milestone not found")

    milestone.status = ms_up.status
    if ms_up.status == "COMPLETED":
        milestone.completed_date = ms_up.completed_date or datetime.utcnow()

    # Check if all milestones are completed to auto-advance problem status
    res_all_ms = await db.execute(select(Milestone).where(Milestone.problem_id == milestone.problem_id))
    all_ms = res_all_ms.scalars().all()
    if all_ms and all(m.status == "COMPLETED" for m in all_ms):
        res_p = await db.execute(select(Problem).where(Problem.id == milestone.problem_id))
        problem = res_p.scalars().first()
        if problem and problem.status != "RESOLVED":
            old_s = problem.status
            problem.status = "VERIFICATION"
            db.add(ProblemStatusHistory(
                problem_id=problem.id,
                from_status=old_s,
                to_status="VERIFICATION",
                changed_by_user_id=current_user.id,
                notes="All implementation milestones completed. Pending citizen verification."
            ))
            db.add(Notification(
                user_id=problem.citizen_id,
                title="All Milestones Completed!",
                message=f"All implementation milestones for '{problem.title}' are done. Please review and provide feedback.",
                type="SUCCESS",
                link=f"/problems/{problem.id}"
            ))

    await db.commit()
    return milestone
