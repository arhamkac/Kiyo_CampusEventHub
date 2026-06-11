# Kiyo Campus Event Hub

A centralized web platform for college communities to create, discover, browse, and register for campus events.

## Getting Started

This repository is structured as a Monorepo containing both the `client` (React) and `server` (Node/Express).

### Prerequisites
- Node.js (v18+)
- PostgreSQL

### 1. Backend (Server) Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the environment variables:
   Create a `.env` file in the `server` directory and add your Postgres database URL:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/campus_events"
   PORT=5000
   ```
4. Run Prisma migrations to set up the database schema:
   ```bash
   npx prisma migrate dev --name init
   ```
5. Start the backend server:
   ```bash
   npm run dev
   ```

### 2. Frontend (Client) Setup
1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

## Technologies Used
- **Frontend**: React.js, Tailwind CSS (v4), React Router, Lucide Icons, date-fns
- **Backend**: Node.js, Express.js, Prisma ORM
- **Database**: PostgreSQL
