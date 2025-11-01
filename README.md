# NoTraffic Backend – Polygon Management API

This is the FastAPI backend for the NoTraffic assignment.

It provides an API for managing polygon shapes over an image, including:
- Creating new polygons
- Fetching all saved polygons
- Deleting polygons

All actions simulate latency with a 5-second delay and persist to a PostgreSQL database.

---

## Features

- Create / fetch / delete polygons
- Polygon data persisted in PostgreSQL
- Automatic 5-second delay in all endpoints
- RESTful API with schema validation
- Dockerized backend with PostgreSQL + pgAdmin
- Unit tests

---

## Run Server (Backend)

### 1. Clone and enter the project:

```bash
git clone https://github.com/naorvilensky/notraffic-polygon-home-assignment.git
cd notraffic-polygon-home-assignment/
```

### 2. Create your `.env` file

Copy the template file:
```bash
cp env.template .env
```

Edit `.env` and make sure it includes:
```env
DATABASE_URL=postgresql+psycopg2://admin:123pass@localhost:5432/polygons_db
```

> If you're running on localhost, use `db` instead of `localhost` in the `DATABASE_URL`.

### 3. Install & run locally

```bash
python -m venv .venv
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

App runs at: http://localhost:8000

---

## Run with Docker Compose

```bash
docker compose up --build
```

Services:
- `backend`: FastAPI app at http://localhost:8000
- `db`: PostgreSQL
- `pgadmin`: UI at http://localhost:5050

Login to pgAdmin with:
- Email: from `.env` → `PGADMIN_DEFAULT_EMAIL`
- Password: from `.env` → `PGADMIN_DEFAULT_PASSWORD`

---

## API Endpoints

| Method | Path             | Description            |
|--------|------------------|------------------------|
| GET    | `/polygons/`     | List all polygons      |
| POST   | `/polygons/`     | Create a new polygon   |
| DELETE | `/polygons/{id}` | Delete a polygon by ID |

> All routes include a 5-second artificial delay

---

## Polygon Format

```json
{
  "name": "MyPolygon",
  "color": "#FF0000",
  "points": [[100, 100], [200, 100], [150, 200]]
}
```

- Must have at least 3 points
- Points must be `[x, y]` floats in image space (0–1920 x 0–1080)

---

## Run Tests

```bash
PYTHONPATH=server pytest
```

---

## Run the Client (Frontend)

The client is a React + Vite app that interacts with the FastAPI backend.

### 1. Navigate to the client folder
```bash
cd client
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```

The app will be available at:  
http://localhost:5173

Make sure the backend is also running (at http://localhost:8000 by default).

## Run Client Tests

The client includes unit and integration tests using Vitest and Testing Library.

### Run all tests
```bash
npm run test
```

This will execute all test suites and display the results in the console.


---

## Author

Created by [Naor Vilensky](mailto:naor.vilensky@gmail.com) for the NoTraffic fullstack assignment.