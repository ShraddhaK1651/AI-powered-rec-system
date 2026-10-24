require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const { connectDB } = require('./config/db');
const { notFoundHandler, errorHandler } = require('./middleware/errorMiddleware');
const aiClient = require('./services/aiServiceClient');

// Import routes
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const ragRoutes = require('./routes/ragRoutes');
const adminRoutes = require('./routes/adminRoutes');
const catalogRoutes = require('./routes/catalogRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Static files for uploaded documents
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check endpoint
app.get('/api/health', async (req, res) => {
  const aiHealth = await aiClient.checkAiServiceHealth();
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date(),
    service: 'AI Guidance Platform Backend API',
    aiServiceStatus: aiHealth,
    environment: process.env.NODE_ENV || 'development',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/rag', ragRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/catalog', catalogRoutes);

// Error Handlers
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const { autoBootstrapIfEmpty } = require('./seeds/autoBootstrap');

// Connect to Database and start server
const startServer = async () => {
  await connectDB();
  await autoBootstrapIfEmpty();
  const server = app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`Node.js Backend Server running on port ${PORT}`);
    console.log(`Base API: http://localhost:${PORT}/api`);
    console.log(`AI Microservice Target: ${process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000'}`);
    console.log(`====================================================`);
  });
  return server;
};

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
