# Setup Guide

## Prerequisites

1. Node.js and pnpm (or npm/yarn)
2. PostgreSQL database

## Installation Steps

### 1. Install Dependencies

```bash
pnpm install
pnpm add @tanstack/react-query
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory with the following variable:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/sheger_soccer_cup?schema=public"
```

### 3. Generate Prisma Client

After any schema changes, regenerate the Prisma client:

```bash
pnpm prisma generate
```

### 4. Set Up Database

1. Make sure PostgreSQL is running
2. Push the schema to your database:

```bash
pnpm db:push
```

This will create the database tables based on the Prisma schema.

### 5. Generate Prisma Client

```bash
pnpm db:generate
```

### 6. Run the Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## Available Routes

- `/` - Main registration page
- `/registrations` - View all registered teams

## API Endpoints

- `POST /api/register` - Register a new team with players
- `GET /api/teams` - Get all registered teams
- `POST /api/uploadthing` - Upload files (handled by UploadThing)

## Database Schema

- **Team**: Stores team information (school name, creation date)
- **Player**: Stores player information (first name, last name, school ID URL, team reference)

## Useful Commands

- `pnpm db:push` - Push schema changes to database
- `pnpm db:studio` - Open Prisma Studio to view/edit database
- `pnpm db:generate` - Generate Prisma Client
