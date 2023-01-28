import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { ExceptionResponse } from '../exception-response';
import { ExtendedExceptionFilter } from './extended-exception.filter';

@Catch(HttpException)
export class HttpExceptionFilter extends ExtendedExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();
    const errorResponse: ExceptionResponse = {
      message: exception.message,
      statusCode: exception.getStatus(),
      method: req.method,
      path: req.url,
      stack: exception.stack,
      cause: exception.cause,
    };
    this.makeResponse(res, errorResponse);
  }
}
