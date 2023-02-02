import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidCredentialsException extends HttpException {
  constructor() {
    super('Either the email or password is incorrect.', HttpStatus.BAD_REQUEST);
  }
}
