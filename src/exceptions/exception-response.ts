export interface ExceptionResponse {
  statusCode: number;
  message: string;
  path?: string;
  method?: string;
  cause?: Error;
  stack?: string;
}
