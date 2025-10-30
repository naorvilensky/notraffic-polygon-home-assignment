from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
import asyncio

from db import get_session
from models.polygon import Polygon
from schemas.polygon import PolygonCreate, PolygonRead

router = APIRouter(prefix="/polygons", tags=["polygons"])

DELAY_SECONDS = 5


@router.get("/", response_model=List[PolygonRead])
async def get_polygons(session: Session = Depends(get_session)):
    await asyncio.sleep(DELAY_SECONDS)
    polygons = session.exec(select(Polygon)).all()
    return polygons


@router.post("/", response_model=PolygonRead, status_code=201)
async def create_polygon(
    data: PolygonCreate,
    session: Session = Depends(get_session),
):
    await asyncio.sleep(DELAY_SECONDS)

    polygon = Polygon(name=data.name, points=data.points)
    session.add(polygon)
    session.commit()
    session.refresh(polygon)

    return polygon


@router.delete("/{polygon_id}", status_code=204)
async def delete_polygon(polygon_id: int, session: Session = Depends(get_session)):
    await asyncio.sleep(DELAY_SECONDS)

    polygon = session.get(Polygon, polygon_id)
    if not polygon:
        raise HTTPException(status_code=404, detail="Polygon not found")

    session.delete(polygon)
    session.commit()
    return None  # 204: No Content
