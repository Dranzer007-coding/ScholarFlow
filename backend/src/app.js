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
const configuredOrigins = (process.env.FRONTEND_URL || '').split(',').map(o => o.trim()).filter(Boolean);
const localhostRegex = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
const vercelNetlifyRegex = /^https:\/\/[a-zA-Z0-9-]+\.(vercel\.app|netlify\.app)$/;

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., curl, Mobile apps, Postman)
    if (!origin) return callback(null, true);
    
    // Allow configured production origins, localhost dev, or any *.vercel.app / *.netlify.app origin
    if (configuredOrigins.includes(origin) || localhostRegex.test(origin) || vercelNetlifyRegex.test(origin) || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    return callback(new Error(`CORS: Origin '${origin}' is not allowed.`));
  },
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Serve uploaded static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Root & Health check
app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'ScholarFlow AI Backend API Engine is live and operational.', healthCheck: '/api/health' });
});

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
