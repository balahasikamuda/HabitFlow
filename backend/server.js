const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Base route & API Health Info
app.get('/', (req, res) => {
  res.json({
    project: 'HabitFlow – Habit Tracking Application',
    status: 'online',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    documentation: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me',
        profile: 'PUT /api/auth/profile',
        settings: 'PUT /api/auth/settings'
      },
      habits: {
        list: 'GET /api/habits',
        create: 'POST /api/habits',
        detail: 'GET /api/habits/:id',
        update: 'PUT /api/habits/:id',
        delete: 'DELETE /api/habits/:id',
        toggle: 'PATCH /api/habits/:id/toggle',
        progress: 'PATCH /api/habits/:id/progress',
        analytics: 'GET /api/habits/analytics/summary',
        calendar: 'GET /api/habits/calendar/overview',
        seed: 'POST /api/habits/seed'
      }
    }
  });
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/habits', require('./routes/habitRoutes'));

// 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Resource not found at ${req.originalUrl}`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]', err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`[HabitFlow Backend] Server running on http://localhost:${PORT}`);
});

module.exports = { app, server };
