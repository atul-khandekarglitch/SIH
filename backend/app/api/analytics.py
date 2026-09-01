from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func

from app.db import get_db
from app.models import Problem, Organization, User

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/dashboard-stats")
async def get_dashboard_analytics(db: AsyncSession = Depends(get_db)):
    # Total problems count
    res_total = await db.execute(select(func.count(Problem.id)))
    total_problems = res_total.scalar_one_or_none() or 0

    # Pending validations count
    res_pending = await db.execute(
        select(func.count(Problem.id)).where(
            Problem.status.in_(["ROUTING_RECOMMENDED", "PENDING_VALIDATION", "AI_ANALYZED"])
        )
    )
    pending_validations = res_pending.scalar_one_or_none() or 0

    # High severity count (>= 8)
    res_high = await db.execute(select(func.count(Problem.id)).where(Problem.severity >= 8))
    high_priority = res_high.scalar_one_or_none() or 0

    # Resolved count
    res_resolved = await db.execute(select(func.count(Problem.id)).where(Problem.status == "RESOLVED"))
    resolved_problems = res_resolved.scalar_one_or_none() or 0

    # Problems by Category
    res_cat = await db.execute(
        select(Problem.category, func.count(Problem.id)).group_by(Problem.category)
    )
    category_counts = {row[0]: row[1] for row in res_cat.all()}

    # Problems by District
    res_dist = await db.execute(
        select(Problem.district, func.count(Problem.id)).group_by(Problem.district)
    )
    district_counts = {row[0]: row[1] for row in res_dist.all()}

    # Problems by Status
    res_stat = await db.execute(
        select(Problem.status, func.count(Problem.id)).group_by(Problem.status)
    )
    status_counts = {row[0]: row[1] for row in res_stat.all()}

    # Organization Involvement
    res_orgs = await db.execute(
        select(Organization.type, func.count(Organization.id)).group_by(Organization.type)
    )
    org_counts = {row[0]: row[1] for row in res_orgs.all()}

    return {
        "total_problems": total_problems,
        "pending_validation": pending_validations,
        "high_priority": high_priority,
        "resolved_problems": resolved_problems,
        "category_counts": category_counts,
        "district_counts": district_counts,
        "status_counts": status_counts,
        "university_involvement": org_counts.get("UNIVERSITY", 2),
        "industry_involvement": org_counts.get("INDUSTRY", 1),
        "government_involvement": org_counts.get("GOVERNMENT", 2),
    }
