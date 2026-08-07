const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const { errorHandler } = require('./middleware/error.middleware');

// Routes imports
const authRoutes = require('./routes/auth.routes');
const scholarshipRoutes = require('./routes/scholarship.routes');
const applicationRoutes = require('./routes/application.routes');
const officerRoutes = require('./routes/officer.routes');
const notificationRoutes = require('./routes/notification.routes');

const app = express();

// Middlewares
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173').split(',').map(o => o.trim());
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., curl, Postman in dev) or from the allowlist
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: Origin '${origin}' is not allowed.`));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Serve uploaded static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'ScholarFlow AI API Server is running smoothly' });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/scholarships', scholarshipRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/officer', officerRoutes);
app.use('/api/notifications', notificationRoutes);

// Global Error Handler
app.use(errorHandler);

module.exports = app;
