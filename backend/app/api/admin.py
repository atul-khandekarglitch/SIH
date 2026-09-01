from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.db import get_db
from app.models import Problem, ProblemAssignment, ProblemStatusHistory, Organization, User, Notification
from app.schemas import ProblemValidateRequest, ProblemResponse
from app.api.auth import get_current_user

router = APIRouter(prefix="/admin", tags=["Admin"])

async def verify_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="Admin authorization required")
    return current_user

@router.get("/validations", response_model=List[ProblemResponse])
async def get_validation_queue(
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(verify_admin)
):
    """Returns problems pending admin validation & route approval."""
    query = select(Problem).where(
        Problem.status.in_(["ROUTING_RECOMMENDED", "PENDING_VALIDATION", "AI_ANALYZED"])
    ).options(
        selectinload(Problem.images),
        selectinload(Problem.assignments).selectinload(ProblemAssignment.organization),
        selectinload(Problem.milestones)
    ).order_by(Problem.severity.desc(), Problem.created_at.desc())

    res = await db.execute(query)
    return res.scalars().all()

@router.post("/problems/{problem_id}/validate")
async def validate_and_assign_problem(
    problem_id: str,
    req: ProblemValidateRequest,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(verify_admin)
):
    res = await db.execute(select(Problem).where(Problem.id == problem_id))
    problem = res.scalars().first()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")

    old_status = problem.status
    problem.recommended_route = req.route
    problem.status = "ASSIGNED"

    # Create status history
    db.add(ProblemStatusHistory(
        problem_id=problem.id,
        from_status=old_status,
        to_status="ASSIGNED",
        changed_by_user_id=admin.id,
        notes=req.notes or f"Admin approved route '{req.route}' and assigned target organizations."
    ))

    # Assign organizations
    if req.assigned_org_ids:
        for org_id in req.assigned_org_ids:
            # Check existing assignment
            res_exist = await db.execute(
                select(ProblemAssignment).where(
                    ProblemAssignment.problem_id == problem_id,
                    ProblemAssignment.organization_id == org_id
                )
            )
            if not res_exist.scalars().first():
                db.add(ProblemAssignment(
                    problem_id=problem.id,
                    organization_id=org_id,
                    status="ASSIGNED"
                ))

    # Send notification to citizen
    db.add(Notification(
        user_id=problem.citizen_id,
        title="Problem Validated & Assigned",
        message=f"Your problem '{problem.title}' has been validated by Admin and assigned for resolution under {req.route}.",
        type="SUCCESS",
        link=f"/problems/{problem.id}"
    ))

    await db.commit()
    return {"message": "Problem validated and assigned successfully", "status": "ASSIGNED"}
