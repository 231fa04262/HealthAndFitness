# Backend (Express + MongoDB)

## Setup
```
npm install
```

Create `.env` with:
```
MONGO_URI=mongodb://localhost:27017/health_and_fitness_db
JWT_SECRET=your_jwt_secret_here
PORT=5000
```

## Run
```
npm run dev
```

## Endpoints
- POST /api/auth/register
- POST /api/auth/login
- GET /api/workouts (auth)
- POST /api/workouts (auth)
- PUT /api/workouts/:id (auth)
- DELETE /api/workouts/:id (auth)
- GET /api/diets (auth)
- POST /api/diets (auth)
- PUT /api/diets/:id (auth)
- DELETE /api/diets/:id (auth)
- GET /api/progress (auth)
- POST /api/progress (auth)
- PUT /api/progress/:id (auth)
- DELETE /api/progress/:id (auth)
