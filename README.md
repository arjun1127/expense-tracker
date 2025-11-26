# Design implemented screen-Shots 
  ## Screenshots

Here are a few screenshots of the deployed app. Place the screenshot files in the repository folder `screenshots/` (or `frontend/public/images/`) and reference them with relative paths.

### 1
<img src=".Screenshot from 2025-11-26 12-31-14.png" width="1200" alt="Dashboard overview" />

### 2 page
<img src="Screenshot from 2025-11-26 12-31-42.png" width="1200" alt="Income records and charts" />

### 2 page (top)
<img src="Screenshot from 2025-11-26 12-32-02.png" width="1200" alt="Expense form and top metrics" />

### 4 page (charts & cards)
<img src="Screenshot from 2025-11-26 12-32-28.png" width="1200" alt="Expense charts and list" />

---
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

# Expense Tracker — Frontend

This is the frontend for the Expense Tracker application. It is a React + Vite app using TailwindCSS, Auth0 (for authentication), Axios for API calls, and several UI/utility libraries (framer-motion, react-hot-toast, recharts, etc.).

---

## Features (high level)
- React 19 + Vite
- Auth0 authentication integration
- Expense list, charts and expense management UI
- TailwindCSS for styling
- API calls via Axios
- Date handling via moment, date picking via react-datepicker
- Recharts for charts and visualizations
- Toast notifications & animations

---

## Tech stack
- React 19
- Vite
- TailwindCSS
- Auth0 (via @auth0/auth0-react)
- Axios
- Recharts
- react-router-dom
- react-hot-toast, react-toastify
- framer-motion

---

## Prerequisites
- Node.js v18+ (or latest LTS)
- npm (or yarn/pnpm)
- A running backend API (if you want to connect to the server)
- Auth0 app credentials (if Auth0 is used in the project)

---

## Quick setup

1. Clone repository (if not already):
   git clone <repo-url>
   cd expense-tracker/frontend

2. Install dependencies:
   npm install

3. Create environment file
   The frontend uses Vite, so environment variables should be prefixed with `VITE_`. Create a file at the project root of the frontend folder named `.env` (this file should not be committed if it contains secrets).

   Example `.env`:
   VITE_API_URL=https://api.example.com
   VITE_AUTH0_DOMAIN=your-auth0-domain.us.auth0.com
   VITE_AUTH0_CLIENT_ID=your-auth0-client-id
   VITE_AUTH0_AUDIENCE=your-auth0-audience
   # Optional
   VITE_APP_NAME=Expense Tracker

   Notes:
   - `VITE_API_URL` is used as the base URL for Axios requests to your backend.
   - Auth0 variables are required only if the app uses Auth0 authentication.

4. Run the dev server:
   npm run dev

   Default Vite dev server port: 5173 (visit http://localhost:5173 unless configured otherwise)

5. Build for production:
   npm run build

6. Preview production build locally:
   npm run preview

---

## Available scripts
(From frontend/package.json)
- npm run dev — start Vite dev server
- npm run build — build production assets
- npm run preview — preview built assets locally
- npm run lint — run ESLint

---

## Project structure (frontend/src)
- src/
  - main.jsx — application entry (mounts React app)
  - App.jsx — top-level app component and routes
  - index.css — global styles (Tailwind directives and custom CSS)
  - assets/ — static assets (images/fonts/etc.)
  - components/ — reusable UI components
  - pages/ — route-level pages (Dashboard, Login, Expenses, etc.)
  - context/ — React Context providers (Auth, state, etc.)
  - hooks/ — custom React hooks
  - utils/ — utility functions (formatters, API helpers)
  - (others) — as the codebase evolves

---

## Auth0 integration
This project includes `@auth0/auth0-react`. To enable authentication:
- Create an Auth0 application at https://manage.auth0.com/
- Add the allowed callback URLs (e.g., http://localhost:5173) and allowed logout URLs
- Add the `VITE_AUTH0_DOMAIN`, `VITE_AUTH0_CLIENT_ID` and optionally `VITE_AUTH0_AUDIENCE` to your `.env` file
- The app will consume those variables where the Auth0Provider is configured (likely in context or main.jsx)

---

## Environment & API
- Ensure your backend exposes endpoints expected by the frontend (check Axios usage in the project to verify endpoints).
- Set `VITE_API_URL` to the base backend URL. Example usage in code:
  axios.create({ baseURL: import.meta.env.VITE_API_URL })

---

## TailwindCSS
- Tailwind is installed and configured for Vite. The global CSS file (`index.css`) likely contains Tailwind directives:
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

- If you need to reconfigure Tailwind, update the `tailwind.config.js` (if present) and postcss/vite plugin settings.

---

## Linting & Types
- ESLint is included (scripts: `lint`).
- Type definitions for React are present in devDependencies (`@types/react`, `@types/react-dom`) to support TypeScript-aware tooling or type hints in editors — but the codebase appears to be JavaScript/JSX.

---

## Common troubleshooting
- Dev server crashes on start:
  - Ensure Node version is compatible.
  - Delete node_modules and reinstall: rm -rf node_modules package-lock.json && npm install
- ENV variables not picked up:
  - Ensure variables are prefixed with `VITE_` and you restarted the dev server after editing `.env`.
- Styling missing:
  - Verify `index.css` is imported in `main.jsx` and Tailwind directives are present.
- Auth login loop:
  - Check Auth0 callback / logout allowed URLs and client settings.

---

## Deployment notes
- Build with `npm run build`. The `dist/` folder can be served by a static host (Netlify, Vercel, Surge, GitHub Pages with appropriate configuration, or a static file server behind your backend).
- If deploying to a platform that sets environment variables, ensure the VITE_* variables are provided to the build environment so the compiled app contains the API and Auth settings.

---

## Contributing
- Open an issue or PR for feature requests or bug fixes.
- Follow existing code style and run `npm run lint` before submitting PRs.

---

