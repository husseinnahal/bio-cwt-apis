import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  // Returns a structured status object indicating backend health and port details
  getStatus() {
    const port = process.env.PORT || 3000;
    const environment = process.env.NODE_ENV || 'development';
    return {
      status: 'healthy',
      message: 'Wood Backend API is running successfully.',
      port: Number(port),
      environment,
      timestamp: new Date().toISOString(),
    };
  }
}
