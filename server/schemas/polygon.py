from pydantic import BaseModel, field_validator
from typing import List
import math


class PolygonBase(BaseModel):
    name: str
    points: List[List[float]]

    @classmethod
    @field_validator("name")
    def validate_name(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Name must not be empty")
        if len(v) > 100:
            raise ValueError("Name must be at most 100 characters")
        return v

    @classmethod
    @field_validator("points")
    def validate_points(cls, points: List[List[float]]) -> List[List[float]]:
        if len(points) < 3:
            raise ValueError("Polygon must have at least 3 points")
        for p in points:
            if not isinstance(p, list) or len(p) != 2:
                raise ValueError("Each point must be a list of two numbers")
            x, y = p
            if not all(isinstance(c, (int, float)) for c in (x, y)):
                raise ValueError("Each coordinate must be a number")
            if any(math.isnan(c) or math.isinf(c) for c in (x, y)):
                raise ValueError("Coordinates must be finite numbers")

            if not (0 <= x <= 1920) or not (0 <= y <= 1080):
                raise ValueError("Point out of bounds (1920x1080)")
        return points


class PolygonCreate(PolygonBase):
    pass


class PolygonRead(PolygonBase):
    id: int
