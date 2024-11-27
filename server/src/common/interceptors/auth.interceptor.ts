import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuthInterceptor.name);

  constructor(private jwtService: JwtService) {}
  private readonly API_PREFIX = '/api/v1';
  private readonly publicPaths = [
    '/admin/signup',
    '/admin/login',
    '/judge/login',
    '/refresh',
    '/',
  ];

  private removePrefix(path: string): string {
    if (path.startsWith(this.API_PREFIX)) {
      return path.slice(this.API_PREFIX.length);
    }
    return path;
  }
  
  private isPublicPath(requestPath: string): boolean {
    const normalizedPath = this.removePrefix(requestPath);
    // Check if the normalized path matches any public path
    return this.publicPaths.some((path) =>
      normalizedPath.toLowerCase().endsWith(path.toLowerCase()),
    );
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();

    if (this.isPublicPath(request.path)) {
      return next.handle();
    }

    try {
      // Check for authentication token
      const authHeader = request.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedException(
          'No valid authentication token provided',
        );
      }

      // Extract and verify the token
      const token = authHeader.split(' ')[1];
      try {
        // Verify token and check expiration
        const payload = this.jwtService.verify(token);

        // Add user information to request object
        request['user'] = payload;

        // Check if token is about to expire (e.g., in less than 5 minutes)
        const expirationTime = payload.exp * 1000; // Convert to milliseconds
        const fiveMinutes = 5 * 60 * 1000;
        if (Date.now() + fiveMinutes >= expirationTime) {
          this.logger.warn('Token is about to expire');
          // TODO: Implement token refresh
        }
      } catch (error) {
        if (error.name === 'TokenExpiredError') {
          throw new UnauthorizedException('Token has expired');
        } else if (error.name === 'JsonWebTokenError') {
          throw new UnauthorizedException('Invalid token');
        }
        throw error;
      }

      return next.handle().pipe(
        catchError((error) => {
          this.logger.error(
            `Authentication error: ${error.message}`,
            error.stack,
          );
          return throwError(() => error);
        }),
      );
    } catch (error) {
      this.logger.error(`Authentication error: ${error.message}`, error.stack);
      throw error;
    }
  }
}
