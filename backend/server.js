// const express = require('express');
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const morgan = require('morgan');
// const path = require('path');

// dotenv.config();

// const app = express();

// // Middleware
// app.use(express.json());

// // CORS: allow specific origin in production, otherwise allow all for dev
// const corsOrigin = process.env.CLIENT_ORIGIN || true;
// app.use(cors({ origin: corsOrigin, credentials: true }));
// if (process.env.NODE_ENV !== 'production') {
//   app.use(morgan('dev'));
// }

// // Routes
// app.get('/api/health', (req, res) => {
//   res.json({ success: true, message: 'API is running' });
// });

// // Serve uploaded images
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/workouts', require('./routes/workout'));
// app.use('/api/diets', require('./routes/diet'));
// app.use('/api/progress', require('./routes/progress'));

// // Serve frontend in production
// if (process.env.NODE_ENV === 'production') {
//   const clientPath = path.join(__dirname, 'client');
//   app.use(express.static(clientPath));
//   app.get('*', (req, res, next) => {
//     if (req.path.startsWith('/api/')) return next();
//     return res.sendFile(path.join(clientPath, 'index.html'));
//   });
// }

// // Basic error handler
// // eslint-disable-next-line no-unused-vars
// app.use((err, req, res, next) => {
//   console.error(err);
//   const status = err.status || 500;
//   res.status(status).json({ success: false, message: err.message || 'Server error' });
// });

// const PORT = process.env.PORT || 5000;
// const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/health_and_fitness_db';

// mongoose
//   .connect(MONGO_URI)
//   .then(() => {
//     console.log('MongoDB connected');
//     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//   })
//   .catch((err) => {
//     console.error('Mongo connection error:', err);
//     process.exit(1);
//   });



// ===============================
// 📦 Import Dependencies
// ===============================
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

// ===============================
// 🧩 Load Environment Variables
// ===============================
// Make sure the .env file is inside the backend folder
dotenv.config({ path: path.join(__dirname, '.env') });

console.log("🔍 Loaded MONGO_URI:", process.env.MONGO_URI); // Debug check

const app = express();

// ===============================
// ⚙️ Middleware Configuration
// ===============================
app.use(express.json());

// CORS setup: allow frontend URL or default to all
const corsOrigin = process.env.CLIENT_ORIGIN || '*';
app.use(cors({ origin: corsOrigin, credentials: true }));

// Logging (only in development)
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// ===============================
// 🩺 Health Check Route
// ===============================
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API is running successfully!' });
});

// ===============================
// 🖼 Serve Uploaded Files
// ===============================
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ===============================
// 🧩 API Routes
// ===============================
// Ensure these files exist in the /routes folder
app.use('/api/auth', require('./routes/auth'));
app.use('/api/workouts', require('./routes/workout'));
app.use('/api/diets', require('./routes/diet'));
app.use('/api/progress', require('./routes/progress'));

// ===============================
// 🌐 Serve Frontend (Production)
// ===============================
if (process.env.NODE_ENV === 'production') {
  const clientPath = path.join(__dirname, '../frontend/dist');
  app.use(express.static(clientPath));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    return res.sendFile(path.join(clientPath, 'index.html'));
  });
}

// ===============================
// ⚠️ Global Error Handler
// ===============================
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  const status = err.status || 500;
  res.status(status).json({ success: false, message: err.message || 'Server error' });
});

// ===============================
// 🚀 Start Server & Connect to MongoDB
// ===============================
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('🚨 MONGO_URI is missing! Check your .env file.');
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
