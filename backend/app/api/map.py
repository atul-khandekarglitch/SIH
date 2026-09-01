from typing import Optional, List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.db import get_db
from app.models import Problem

router = APIRouter(prefix="/map", tags=["Interactive Map Data"])

@router.get("/markers")
async def get_map_markers(
    category: Optional[str] = None,
    district: Optional[str] = None,
    severity_min: Optional[int] = None,
    status: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    query = select(Problem).order_by(Problem.created_at.desc())

    if category:
        query = query.where(Problem.category == category)
    if district:
        query = query.where(Problem.district == district)
    if severity_min:
        query = query.where(Problem.severity >= severity_min)
    if status:
        query = query.where(Problem.status == status)

    res = await db.execute(query)
    problems = res.scalars().all()

    markers = []
    for p in problems:
        # Default coordinates for Jharkhand districts if lat/lng missing
        lat = p.location_lat or 23.3441
        lng = p.location_lng or 85.3096
        
        markers.append({
            "id": p.id,
            "title": p.title,
            "category": p.category,
            "subcategory": p.subcategory,
            "severity": p.severity,
            "urgency": p.urgency,
            "public_impact": p.public_impact,
            "district": p.district,
            "address": p.address,
            "status": p.status,
            "lat": lat,
            "lng": lng,
            "ai_summary": p.ai_summary,
            "created_at": p.created_at
        })

    return markers
