import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.db import engine, Base, AsyncSessionLocal
from app.services.seed_service import seed_demo_data

@pytest_asyncio.fixture(autouse=True)
async def setup_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    async with AsyncSessionLocal() as session:
        await seed_demo_data(session)

@pytest.mark.asyncio
async def test_root():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "online"

@pytest.mark.asyncio
async def test_analytics():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/v1/analytics/dashboard-stats")
    assert response.status_code == 200
    data = response.json()
    assert "total_problems" in data
    assert data["total_problems"] > 0

@pytest.mark.asyncio
async def test_map_markers():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/v1/map/markers")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) > 0
