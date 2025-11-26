
# Expense Tracker — Backend

This README documents the backend for the Expense Tracker project (Express API). It covers features, folder structure, environment variables, setup, and usage.

## Features

- User authentication (register / login — JWT-based)
- CRUD for incomes and expenses
- Dashboard endpoints for aggregated summaries (totals, charts)
- File upload support (uploads served statically)
- CORS-enabled API with configurable client origin
- Database connection utility (MongoDB)

## Tech stack (backend)
- Node.js + Express
- MongoDB (mongoose expected)
- dotenv for configuration
- CORS middleware
- Static file serving for uploads

(Exact dependency list is in package.json in the backend folder.)

## Folder structure (important parts)
- backend/
  - config/         — database connection and other configuration (connectDb)
  - controllers/    — route handlers (auth, income, expense, dashboard)
  - middlewares/    — auth, validation, error handlers
  - models/         — Mongoose models (User, Income, Expense, etc.)
  - routes/         — express routes (authRoutes, incomeRoutes, expenseRoute, dashboardRoute)
  - uploads/        — uploaded files (served statically)
  - utils/          — utility helpers
  - server.js       — entrypoint; mounts routes and static uploads
  - Expense.xlsx, incomes.xlsx — sample/seed spreadsheets included in repository

## Important routes (mounted in server.js)
- /api/v1/auth     — authentication (register, login, profile, etc.)
- /api/v1/income   — income CRUD
- /api/v1/expense  — expense CRUD
- /api/v1/dashboard — aggregated data for UI

Uploads are served statically from:
- /uploads/*  (e.g. http://localhost:5000/uploads/filename.jpg)

Requests that require authentication expect an Authorization header:
- Authorization: Bearer <JWT_TOKEN>

## Environment variables (.env)

Create a `.env` file in the `backend` directory. Example variables used by the server:

```
PORT=5000
MONGO_URI=your URL
CLIENT_URL=vite url or deployed url
JWT_SECRET=your_jwt_secret_here
```

Notes:
- `CLIENT_URL` is used for CORS; if not set the server allows all origins (see server.js).
- `MONGO_URI` can be a local MongoDB connection string or MongoDB Atlas URI.
- `JWT_SECRET` should be a long random string in production.

## Setup (local development)

1. Clone the repository and change into the backend folder
   - git clone <repo-url>
   - cd expense-tracker/backend

2. Install dependencies
   - npm install

3. Create `.env` in `backend/` with the variables shown above.

4. Start MongoDB (local or ensure your Atlas URI is ready).

5. Run the server
   - For production: node server.js
   - For development (recommended): npm run dev
     - If `npm run dev` isn't defined, install nodemon and run: npx nodemon server.js

6. The server listens on the port configured in `PORT` (default 5000).
   - Example: http://localhost:5000

## Seed / sample data
The `backend` contains `Expense.xlsx` and `incomes.xlsx` which you can use as sample data for importing if the project includes import utilities. Check controllers or utils for import scripts.

## Development notes & tips
- Check `config/db` for the database connection logic. If you need to change DB options or logging, modify that file.
- CORS is currently configured to use `CLIENT_URL` or fallback to `*`. For production, set `CLIENT_URL` to your frontend URL.
- Static uploads are served from the `uploads` directory. Keep it outside of version control if storing sensitive files.
- Protect routes with authentication middleware (the project contains a `middlewares` folder for that).
- Add input validation and rate-limiting for public endpoints for extra security (consider using express-validator and express-rate-limit).

## Production considerations
- Use environment variables for all secrets and DB credentials.
- Use HTTPS and strong CORS configuration.
- Store uploads in an object store (S3, GCS) or a secure file server for scale.
- Add logging and monitoring (Morgan, Winston, or a hosted solution).
- Run migrations/seed scripts carefully; backup DB before destructive operations.

## API testing
- Use Postman / Insomnia to test endpoints.
- Remember to include Authorization: Bearer <token> for protected routes.
- Use the `CLIENT_URL` value to allow your frontend to call the API.

---
