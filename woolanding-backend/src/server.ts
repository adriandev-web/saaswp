import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { apiLimiter } from './middleware/rateLimiter';
import { testConnection } from './utils/database';

// Load environment variables
dotenv.config();

// Initialize Express app
const app: Application = express();
const PORT = process.env.PORT || 3000;
const API_VERSION = process.env.API_VERSION || 'v1';

// Middleware
app.use(
  helmet({
    contentSecurityPolicy: false, // Disable for React app
    crossOriginEmbedderPolicy: false,
  })
);
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Request logging middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Rate limiting for API routes
app.use(`/${API_VERSION}`, apiLimiter);

// Serve static files from frontend build
const frontendPath = path.join(__dirname, '../../woolanding-frontend/dist');
app.use(express.static(frontendPath));

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: API_VERSION,
  });
});

// Mount API routes
app.use(`/${API_VERSION}`, routes);

// API base route - documentation
app.get(`/${API_VERSION}`, (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'WooLanding AI Generator API',
    version: API_VERSION,
    status: 'active',
    endpoints: {
      health: '/health',
      auth: `/${API_VERSION}/auth`,
      user: `/${API_VERSION}/user`,
      generate: `/${API_VERSION}/generate`,
      plans: `/${API_VERSION}/plans`,
    },
    documentation: {
      auth: {
        register: `POST /${API_VERSION}/auth/register`,
        login: `POST /${API_VERSION}/auth/login`,
        refresh: `POST /${API_VERSION}/auth/refresh`,
        me: `GET /${API_VERSION}/auth/me`,
        changePassword: `POST /${API_VERSION}/auth/change-password`,
      },
      user: {
        profile: `GET /${API_VERSION}/user/profile`,
        updateProfile: `PUT /${API_VERSION}/user/profile`,
        stats: `GET /${API_VERSION}/user/stats`,
        deleteAccount: `DELETE /${API_VERSION}/user/account`,
      },
      generate: {
        create: `POST /${API_VERSION}/generate`,
        history: `GET /${API_VERSION}/generate/history`,
        getById: `GET /${API_VERSION}/generate/:id`,
      },
      plans: {
        all: `GET /${API_VERSION}/plans`,
        byId: `GET /${API_VERSION}/plans/:id`,
        bySlug: `GET /${API_VERSION}/plans/slug/:slug`,
      },
    },
  });
});

// SPA fallback - serve index.html for all non-API routes
// This must be AFTER all API routes
app.get('*', (req: Request, res: Response) => {
  const indexPath = path.join(frontendPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      // If frontend build not found, send 404
      res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Frontend build not found. Please build the frontend first.',
      });
    }
  });
});

// Global error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, async () => {
  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║                                                       ║');
  console.log('║       🚀 WooLanding AI Generator API Server          ║');
  console.log('║                                                       ║');
  console.log('╚═══════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`  ➜ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`  ➜ Port: ${PORT}`);
  console.log(`  ➜ API Version: ${API_VERSION}`);
  console.log(`  ➜ URL: http://localhost:${PORT}`);
  console.log(`  ➜ API: http://localhost:${PORT}/${API_VERSION}`);
  console.log(`  ➜ Health Check: http://localhost:${PORT}/health`);
  console.log('');

  // Test database connection
  console.log('  🔌 Testing database connection...');
  const dbConnected = await testConnection();
  if (dbConnected) {
    console.log('  ✓ Database connection successful');
  } else {
    console.log('  ✗ Database connection failed');
    console.log('  ⚠️  API will run but database operations will fail');
  }

  console.log('');
  console.log('  📚 Available Routes:');
  console.log(`     - POST /${API_VERSION}/auth/register - Register new user`);
  console.log(`     - POST /${API_VERSION}/auth/login - User login`);
  console.log(`     - POST /${API_VERSION}/generate - Generate landing page`);
  console.log(`     - GET  /${API_VERSION}/plans - Get pricing plans`);
  console.log('');
  console.log('  🌐 Frontend Routes (SPA):');
  console.log('     - GET  / - Home page');
  console.log('     - GET  /login - Login page');
  console.log('     - GET  /register - Register page');
  console.log('     - GET  /dashboard - Dashboard (protected)');
  console.log('     - GET  /generate - Generate page (protected)');
  console.log('');
  console.log('  Press Ctrl+C to stop the server');
  console.log('');
});

export default app;
