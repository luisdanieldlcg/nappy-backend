import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private logger = new Logger();
  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const request = context.getRequest<Request>();
    const response = context.getResponse<Response>();

    let status: HttpStatus;
    let message: string;
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message =
        (exception.getResponse() as ExceptionResponse).message ||
        exception.message;
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Something went wrong. Try again or contact with support.';
    }
    const errorResponse = this.getErrorResponse(
      request,
      status,
      message,
      exception instanceof Error ? exception.stack : '',
    );
    this.logError(errorResponse, exception);
    response.status(status).json(errorResponse);
  }
  private getErrorResponse = (
    req: Request,
    status: HttpStatus,
    message: string,
    stackTrace: string,
  ): HttpExceptionResponse => ({
    statusCode: status,
    message,
    path: req.url,
    method: req.method,
    timeStamp: new Date(),
    stackTrace,
  });

  private logError(errorResponse: HttpExceptionResponse, exception: any): void {
    const log = {
      ...errorResponse,
      timeStamp: errorResponse.timeStamp,
      stackTrace: exception instanceof Error ? exception.stack : null,
    };
    this.logger.error(log.message, log);
  }
}

interface ExceptionResponse {
  statusCode: number;
  message: string;
}

interface HttpExceptionResponse extends ExceptionResponse {
  path: string;
  method: string;
  timeStamp: Date;
  stackTrace: string;
}
