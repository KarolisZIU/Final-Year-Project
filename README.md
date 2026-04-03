# Service Booking System

A full-stack web application for managing service appointments. Customers can browse services, book appointments with staff, and manage their bookings. Admins can manage services, staff, and schedules.

## Tech Stack

- **Frontend:** Vue 3 + Vite + Tailwind CSS
- **Backend:** Node.js + Express
- **Database:** PostgreSQL

---

## Prerequisites

Make sure you have the following installed before starting:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [PostgreSQL](https://www.postgresql.org/download/) (v14 or higher)
- npm (comes with Node.js)

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone <your-github-repo-url>
cd project
```

### 2. Set up the database

Open **pgAdmin** or **psql** and:

1. Create a new database called `booking_app`
2. Run the schema SQL file to create all the tables:

```bash
psql -U postgres -d booking_app -f schema.sql
```

> If you don't have the `schema.sql` file, ask the project owner to share it.

### 3. Configure the backend environment

Navigate to the backend folder and create a `.env` file:

```bash
cd backend
cp .env.example .env
```

Then open `.env` and fill in your values:

```
DATABASE_URL=postgresql://postgres:YOUR_POSTGRES_PASSWORD@localhost:5432/booking_app
JWT_SECRET=any_random_secret_string_you_choose
```

Replace `YOUR_POSTGRES_PASSWORD` with your local PostgreSQL password.

> The `JWT_SECRET` can be anything — e.g. `mysecretkey123`. It's used to sign login tokens.

### 4. Install backend dependencies

```bash
cd backend
npm install
```

### 5. Install frontend dependencies

```bash
cd frontend/myapp
npm install
```

---

## Running the Project

You need **two terminals** open at the same time.

**Terminal 1 — Start the backend:**

```bash
cd backend
npm run dev
```

The API will be running at: `http://localhost:3000`

You can verify it's working by visiting: `http://localhost:3000/api/health`

**Terminal 2 — Start the frontend:**

```bash
cd frontend/myapp
npm run dev
```

The app will be running at: `http://localhost:5173`

Open your browser and go to `http://localhost:5173`

---

## Default Admin Login

Once the database is set up with seed data, you can log in to the admin panel at:

`http://localhost:5173/login`

> Ask the project owner for the admin username and password, or check the database seed data.

---

## Project Structure

```
project/
├── backend/
│   ├── controllers/      # Request handlers
│   ├── routes/           # API route definitions
│   ├── services/         # Business logic
│   ├── repositories/     # Database queries
│   ├── middleware/        # Auth middleware
│   ├── database.js       # PostgreSQL connection
│   ├── server.js         # Express entry point
│   └── .env              # Your local config (not committed)
└── frontend/myapp/
    └── src/
        ├── pages/        # Page components
        ├── components/   # Reusable UI components
        ├── router.js     # Vue Router + auth guards
        └── auth.js       # Auth token helpers
```

---

## Common Issues

**Backend won't start — "password authentication failed"**

> Your PostgreSQL password in `.env` is wrong. Double-check `DATABASE_URL`.

**Backend won't start — "database does not exist"**

> Make sure you created the `booking_app` database and ran the schema SQL.

**Frontend shows blank page or errors in console**

> Make sure the backend is running first on port 3000.

**Port already in use**

> Something else is using port 3000 or 5173. Stop the other process or restart your computer.
