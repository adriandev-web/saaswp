import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/authRoutes';

// Load environment variables
dotenv.config();

// Initialize Express app
const app: Application = express();
const PORT = process.env.PORT || 3000;
const API_VERSION = process.env.API_VERSION || 'v1';

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for inline styles in HTML pages
})); // Security headers
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true,
}));
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// Request logging middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Root redirect to login
app.get('/', (_req: Request, res: Response) => {
  res.redirect('/login.html');
});

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

// API base route
app.get(`/${API_VERSION}`, (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'WooLanding AI Generator API',
    version: API_VERSION,
    endpoints: {
      health: '/health',
      auth: `/${API_VERSION}/auth`,
      apiKeys: `/${API_VERSION}/api-keys`,
      generate: `/${API_VERSION}/generate`,
      subscription: `/${API_VERSION}/subscription`,
      user: `/${API_VERSION}/user`,
    },
  });
});

// Mount routes
app.use(`/${API_VERSION}/auth`, authRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// Error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
  });
});

// Start server
app.listen(PORT, () => {
  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║                                                       ║');
  console.log('║       🚀 WooLanding AI Generator API Server          ║');
  console.log('║                                                       ║');
  console.log('╚═══════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`  ➜ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`  ➜ Port: ${PORT}`);
  console.log(`  ➜ API Version: ${API_VERSION}`);
  console.log('');
  console.log('  📱 Frontend:');
  console.log(`     • Login: http://localhost:${PORT}/login.html`);
  console.log(`     • Dashboard: http://localhost:${PORT}/dashboard.html`);
  console.log('');
  console.log('  🔌 API Endpoints:');
  console.log(`     • Health: http://localhost:${PORT}/health`);
  console.log(`     • Auth: http://localhost:${PORT}/${API_VERSION}/auth`);
  console.log('');
  console.log('  Press Ctrl+C to stop the server');
  console.log('');
});

export default app;
