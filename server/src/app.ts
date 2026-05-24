
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes/index.js';
import { errorHandler, notFound } from './middleware/error.js';

function getAllowedOrigins() {
  const envValue = process.env.CLIENT_ORIGIN ?? process.env.CLIENT_URL ?? 'http://localhost:5173';
  return envValue.split(',').map((s) => s.trim()).filter(Boolean);
}

export function createApp() {
  const app = express();

  app.use(helmet({
    crossOriginResourcePolicy: false
  }));
  app.use(cors({
    origin: getAllowedOrigins(),
    credentials: true
  }));
  app.use(express.json({ limit: '1mb' }));
  app.use(cookieParser());
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'scholarquest-api', timestamp: new Date().toISOString() });
  });

  app.use('/api', routes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
