# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Commands

### Development Setup

**Start MongoDB** (must be running before backend):
```powershell
# Ensure MongoDB is running locally or use the cloud URI in backend/.env
```

**Backend (Express API)**:
```powershell
cd backend
npm install
npm run dev  # Uses nodemon for auto-reload
```

**Frontend (Vite + React)**:
```powershell
cd frontend
npm install
npm run dev  # Usually runs on http://localhost:5173
```

### Production Build

```powershell
# Build frontend
cd frontend
npm run build

# Preview production build
npm run preview

# Run backend in production (after copying frontend/dist to backend/client)
cd backend
$env:NODE_ENV="production"
node server.js
```

### Testing & Development

**Backend**: Default port 5000
**Frontend**: Default Vite port 5173 (check console output)

No test framework is currently configured in this repository.

## Architecture

### Tech Stack
- **Backend**: Node.js/Express with Mongoose (MongoDB ODM)
- **Frontend**: React 18 (Vite), React Router, Tailwind CSS, Framer Motion
- **Auth**: JWT tokens stored in localStorage, bcryptjs for password hashing
- **API Communication**: Axios with interceptors for token injection

### Project Structure

```
backend/
  controllers/  # Business logic for routes
  middleware/   # auth.js (JWT verification), upload.js (multer)
  models/       # Mongoose schemas: User, Workout, Diet, Progress
  routes/       # Express route definitions
  uploads/      # Static file storage for profile photos
  server.js     # Entry point

frontend/
  src/
    components/ # Page-level React components
    api.js      # Axios instance with auth interceptor
    App.jsx     # Main router and navbar
    index.jsx   # React entry point
```

### Authentication Flow

1. User registers/logs in via `/api/auth/register` or `/api/auth/login`
2. Backend returns JWT token signed with `JWT_SECRET` from `.env`
3. Frontend stores token in `localStorage.token` and user data in `localStorage.user`
4. `api.js` Axios interceptor automatically attaches `Bearer ${token}` to all requests
5. Backend `middleware/auth.js` verifies JWT on protected routes, sets `req.user.id`
6. ProtectedRoute component in `App.jsx` checks for token and redirects to `/login` if missing

### Data Models

**User** (`models/User.js`):
- Email/password authentication (password pre-hashed on save)
- Profile fields: username, age, weight, height, goals, profilePic
- Weekly workout tracking: weeklyGoal (default 3), weeklyDays (array of 0-6 for Sun-Sat)

**Workout** (`models/Workout.js`):
- Belongs to User via `userId`
- Fields: type (string), duration (minutes), notes, date
- Used for tracking exercise sessions

**Diet** (`models/Diet.js`):
- Belongs to User via `userId`
- Contains array of meals: `{ name, calories, time }`
- Tracks `totalCalories` per day

**Progress** (`models/Progress.js`):
- Belongs to User via `userId`
- Tracks weight over time and workoutDone flag
- One entry per date for trend visualization

### API Routes

All routes prefixed with `/api`:

**Auth** (`/auth`):
- `POST /register` - Create account
- `POST /login` - Get JWT token
- `PUT /profile` (protected) - Update user profile
- `POST /profile/photo` (protected) - Upload profile picture (uses multer)

**Workouts, Diets, Progress** (all protected):
- `GET /{resource}` - List all for current user
- `POST /{resource}` - Create new entry
- `PUT /{resource}/:id` - Update by ID (user-scoped)
- `DELETE /{resource}/:id` - Delete by ID (user-scoped)

Controllers ensure users can only access their own data by filtering with `userId: req.user.id`.

### Frontend Routing

- `/` - Public home page
- `/register`, `/login` - Auth pages
- `/dashboard` (protected) - Overview with charts for last 7 days, weekly goal tracker
- `/workouts` (protected) - Workout planner/tracker
- `/diet` (protected) - Diet/meal tracking
- `/progress` (protected) - Weight and progress visualization
- `/tips` (protected) - Health tips
- `/profile` (protected) - Update user profile and weekly goals

ProtectedRoute HOC wraps authenticated pages and redirects to `/login` if no token exists.

### Environment Configuration

**Backend** (`backend/.env`):
```
MONGO_URI=mongodb://localhost:27017/health_and_fitness_db
JWT_SECRET=your_jwt_secret
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
NODE_ENV=development
```

**Frontend** (`frontend/.env`):
```
VITE_API_BASE_URL=http://localhost:5000/api
```

Frontend `api.js` defaults to production URL (`https://healthandfitness-2.onrender.com/api`) if `VITE_API_BASE_URL` is not set.

### Key Implementation Details

- **Password Security**: User model has pre-save hook to hash passwords with bcryptjs, plus `comparePassword` method
- **JWT Verification**: `middleware/auth.js` extracts Bearer token, verifies with `JWT_SECRET`, attaches `req.user.id`
- **File Uploads**: Profile photos handled by multer middleware (`middleware/upload.js`), stored in `backend/uploads/`, served statically at `/uploads`
- **Dashboard Charts**: Uses inline bar/line chart components (no external charting library) to visualize workout minutes, calories, and weight trends over last 7 days
- **Weekly Goal Tracking**: Dashboard calculates workout completion by counting unique weekdays in current week (Sunday-Saturday) and compares to user's `weeklyGoal`
- **Production Serving**: When `NODE_ENV=production`, backend serves frontend static files from `backend/client` or `../frontend/dist` and handles SPA fallback routing

### Development Notes

- All React files use `.jsx` extension, no TypeScript
- Tailwind configured to scan `./index.html` and `./src/**/*.{js,jsx}`
- Backend uses CommonJS (`require`/`module.exports`)
- Frontend uses ES modules (`import`/`export`)
- API responses follow convention: `{ success: boolean, message: string, data?: any }`
- MongoDB models use timestamps (createdAt/updatedAt) automatically
