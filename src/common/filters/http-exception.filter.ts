import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse() as any;
      
      if (status === HttpStatus.NOT_FOUND) {
        error = 'Not Found';
        const path = request.url;
        // Check if the user forgot the global "/api" prefix
        if (!path.startsWith('/api/')) {
          message = `API route not found. Did you forget the '/api' prefix? You requested: ${request.method} ${path}`;
        } else {
          message = `API endpoint not found: ${request.method} ${path}`;
        }
      } else {
        message = typeof exceptionResponse === 'object' && exceptionResponse.message 
          ? exceptionResponse.message 
          : exception.message;
        error = typeof exceptionResponse === 'object' && exceptionResponse.error 
          ? exceptionResponse.error 
          : 'Error';
      }
    }

    response.status(status).json({
      statusCode: status,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
