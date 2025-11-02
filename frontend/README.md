# Frontend (Vite + React + Tailwind)

## Setup
```
npm install
```

## Run
```
npm run dev
```

## Tailwind
- Configured in `tailwind.config.js` with content paths: `./index.html`, `./src/**/*.{js,jsx}`
- PostCSS configured in `postcss.config.js`
- Styles imported in `src/index.css`

## Routing
- `/register`, `/login`
- `/` (Dashboard, protected)
- `/workouts` (protected)
- `/diet` (protected)
- `/progress` (protected)

## API Base URL
- `http://localhost:5000/api` (see `src/api.js`)
