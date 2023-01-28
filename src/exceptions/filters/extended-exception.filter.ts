import {
  ArgumentsHost,
  ExceptionFilter,
  HttpStatus,
  Inject,
  Logger,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import mainConfig from 'src/config/main.config';
import { ExceptionResponse } from '../exception-response';
import { Response } from 'express';
export abstract class ExtendedExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(mainConfig.KEY)
    private readonly configService: ConfigType<typeof mainConfig>,
  ) {}

  private readonly logger = new Logger();

  abstract catch(exception: any, host: ArgumentsHost): any;

  public makeResponse(res: Response, errorResponse: ExceptionResponse) {
    const env = this.configService.ENVIRONMENT;
    if (env.includes('dev')) {
      this.logDev(errorResponse);
      return res.status(errorResponse.statusCode).json({
        ...errorResponse,
      });
    }
    this.logProd(errorResponse.statusCode, errorResponse.message);
    return res.status(errorResponse.statusCode).json({
      code: errorResponse.statusCode,
      message: errorResponse.message,
    });
  }
  private logDev(err: ExceptionResponse) {
    this.logger.error({
      ...err,
    });
  }
  private logProd(statusCode: HttpStatus, message: string) {
    this.logger.error(`Code [${statusCode}]: ${message}`);
  }
}
