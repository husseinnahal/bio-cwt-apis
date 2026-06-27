import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: process.env.PORT || 3000,
  environment: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'super-secret-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '30m',
  jwtRefreshSecret:
    process.env.JWT_REFRESH_SECRET || 'super-secret-refresh-key',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '15d',
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '2000', 10),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3001',
}));
