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

#### Ensure dependencies
- Ensure node v22 is available.
- Ensure PostgreSQL is running and accessible.
- Add necessary environment variables by c

```
cd backend
npm install
npm run build
npm run start
```

#### Migrations
```
DATABASE_URL=<url> npm run migrate:up
```
