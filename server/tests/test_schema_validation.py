import pytest
import sys
import os
from pydantic import ValidationError

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from schemas.polygon import PolygonCreate


def test_valid_polygon():
    data = {
        "name": "MyPolygon",
        "color": "white",
        "points": [[0, 0], [1, 0], [0.5, 1]]
    }
    polygon = PolygonCreate(**data)
    assert polygon.name == "MyPolygon"
    assert len(polygon.points) == 3


def test_reject_empty_name():
    with pytest.raises(ValidationError) as e:
        PolygonCreate(name="", color="white", points=[[0, 0], [1, 0], [0.5, 1]])
    assert "name must not be empty" in str(e.value)


def test_reject_too_long_name():
    long_name = str("x" * 101)
    with pytest.raises(ValidationError):
        PolygonCreate(name=long_name, color="white", points=[[0, 0], [1, 0], [0.5, 1]])


def test_reject_too_few_points():
    with pytest.raises(ValidationError):
        PolygonCreate(name="TooSmall", color="white", points=[[0, 0], [1, 0]])


def test_reject_invalid_point_format():
    with pytest.raises(ValidationError):
        PolygonCreate(name="BadPoint", color="white", points=[[0, 0], [1]])


def test_reject_non_numeric_point():
    with pytest.raises(ValidationError):
        PolygonCreate(name="BadPoint", color="white", points=[[0, 0], ["a", "b"], [1, 1]])


def test_reject_out_of_bounds():
    with pytest.raises(ValidationError):
        PolygonCreate(name="OutOfBounds", color="white", points=[[9999, 9999], [1, 0], [0, 1]])
