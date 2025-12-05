import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Express app
const app: Application = express();
const PORT = process.env.PORT || 3000;
const API_VERSION = process.env.API_VERSION || 'v1';

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true,
}));
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: API_VERSION,
  });
});

// API base route
app.get(`/${API_VERSION}`, (req: Request, res: Response) => {
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

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
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
  console.log(`  ➜ URL: http://localhost:${PORT}`);
  console.log(`  ➜ Health Check: http://localhost:${PORT}/health`);
  console.log('');
  console.log('  Press Ctrl+C to stop the server');
  console.log('');
});

export default app;
