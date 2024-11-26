import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Logger,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { Observable, throwError } from 'rxjs';
  import { catchError } from 'rxjs/operators';
  
  @Injectable()
  export class GlobalErrorInterceptor implements NestInterceptor {
    private readonly logger = new Logger(GlobalErrorInterceptor.name);
  
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      return next.handle().pipe(
        catchError((error) => {
          let status = HttpStatus.INTERNAL_SERVER_ERROR;
          let message = 'Internal server error';
          console.log({error:error.getResponse()})
          if (error instanceof HttpException) {
            const errorResponse = error.getResponse();
            status = error.getStatus();
            message = Array.isArray(errorResponse?.['message']) ? errorResponse?.['message'][0] : errorResponse?.['message'];
          } else if (error instanceof Error) {
            message = error.message;
            status = error['code'] || error['status'] || status;
          }
  
          this.logger.error(
            `Error occurred: ${message}`,
            error.stack,
            `${context.getClass().name} - ${context.getHandler().name}`,
          );
  
          return throwError(
            () =>
              new HttpException(
                {
                  status,
                  error: message,
                },
                status,
              ),
          );
        }),
      );
    }
  }
  