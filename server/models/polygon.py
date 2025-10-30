from sqlmodel import SQLModel, Field, Column
from sqlalchemy.dialects.postgresql import JSONB
from typing import List
from datetime import datetime


class Polygon(SQLModel, table=True):
    __tablename__ = "polygons"

    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(nullable=False, max_length=100)

    # Stored as JSONB column in Postgres
    points: List[List[float]] = Field(
        sa_column=Column(JSONB, nullable=False)
    )

    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
