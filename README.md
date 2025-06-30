# Skill Share Marketplace

This is a fullstack application for a skill share marketplace.

## Tech Stack
- **Frontend:** Next.js (TypeScript, Tailwind CSS, shadcn/ui)
- **Backend:** Express.js (TypeScript)
- **Database:** PostgreSQL (pg, node-pg-migrate)

## Project Structure
- `frontend/` — Next.js app
- `backend/` — Express.js API

## Setup Instructions

### Frontend
```
cd frontend
npm install
npm run dev
```

### Backend
```
cd backend
npm install
npm run dev
```

### Database
- Ensure PostgreSQL is running and accessible.
- Configure your database connection in the backend.
- Use `node-pg-migrate` for migrations.

## Features
- Provider/User signup & login
- Task and skill management
- Offer and task progress workflows
- RESTful API with OpenAPI spec

## Development
- Use TypeScript everywhere
- Follow RESTful best practices
- Add tests for backend and frontend

---

For more details, see the requirements in `requirements.txt`.
