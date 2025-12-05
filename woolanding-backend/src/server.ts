import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
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
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
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

// Root route - HTML landing page
app.get('/', (_req: Request, res: Response) => {
  const html = `
    <!DOCTYPE html>
    <html lang="pl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>WooLanding AI Generator API</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .container {
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          max-width: 600px;
          width: 100%;
          padding: 40px;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 48px;
          margin-bottom: 10px;
        }
        h1 {
          color: #2d3748;
          font-size: 28px;
          margin-bottom: 10px;
        }
        .subtitle {
          color: #718096;
          font-size: 16px;
        }
        .status {
          background: #48bb78;
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          display: inline-block;
          font-size: 14px;
          font-weight: 600;
          margin-top: 15px;
        }
        .section {
          margin: 30px 0;
        }
        .section h2 {
          color: #2d3748;
          font-size: 20px;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .contact-info {
          background: #f7fafc;
          padding: 20px;
          border-radius: 10px;
          border-left: 4px solid #667eea;
        }
        .contact-item {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 12px 0;
          color: #4a5568;
        }
        .contact-item strong {
          color: #2d3748;
          min-width: 80px;
        }
        .endpoints {
          list-style: none;
        }
        .endpoint {
          background: #f7fafc;
          padding: 12px 16px;
          margin: 8px 0;
          border-radius: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: transform 0.2s;
        }
        .endpoint:hover {
          transform: translateX(5px);
          background: #edf2f7;
        }
        .endpoint-path {
          color: #667eea;
          font-family: 'Courier New', monospace;
          font-weight: 600;
        }
        .endpoint-desc {
          color: #718096;
          font-size: 14px;
        }
        a {
          color: #667eea;
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
          color: #718096;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🚀</div>
          <h1>WooLanding AI Generator</h1>
          <p class="subtitle">Platforma SaaS do generowania landing pages z AI</p>
          <span class="status">✓ API działa</span>
        </div>

        <div class="section">
          <h2>📡 Dostępne endpointy</h2>
          <ul class="endpoints">
            <li class="endpoint">
              <span class="endpoint-path">/health</span>
              <span class="endpoint-desc">Status serwera</span>
            </li>
            <li class="endpoint">
              <span class="endpoint-path">/${API_VERSION}</span>
              <span class="endpoint-desc">Dokumentacja API</span>
            </li>
            <li class="endpoint">
              <span class="endpoint-path">/${API_VERSION}/auth</span>
              <span class="endpoint-desc">Autoryzacja</span>
            </li>
            <li class="endpoint">
              <span class="endpoint-path">/${API_VERSION}/generate</span>
              <span class="endpoint-desc">Generowanie landing pages</span>
            </li>
          </ul>
        </div>

        <div class="section">
          <h2>📞 Kontakt</h2>
          <div class="contact-info">
            <div class="contact-item">
              <strong>Email:</strong>
              <a href="mailto:contact@woolanding.com">contact@woolanding.com</a>
            </div>
            <div class="contact-item">
              <strong>GitHub:</strong>
              <a href="https://github.com/adriandev-web/saaswp" target="_blank">adriandev-web/saaswp</a>
            </div>
            <div class="contact-item">
              <strong>Wersja API:</strong>
              <span>${API_VERSION}</span>
            </div>
            <div class="contact-item">
              <strong>Środowisko:</strong>
              <span>${process.env.NODE_ENV || 'development'}</span>
            </div>
          </div>
        </div>

        <div class="footer">
          <p>© 2024 WooLanding AI Generator. Wszystkie prawa zastrzeżone.</p>
          <p>Stworzone przez <strong>Adrian Dev Web</strong></p>
        </div>
      </div>
    </body>
    </html>
  `;
  res.status(200).send(html);
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

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
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
  console.log('  Press Ctrl+C to stop the server');
  console.log('');
});

export default app;
