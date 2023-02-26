import { BadRequestException } from '@nestjs/common';

export class InvalidImageFormatException extends BadRequestException {
  constructor() {
    super('The file must be of one of these formats: PNG, JPG, JPEG.');
  }
}
export class ImageFormatMismatchException extends BadRequestException {
  constructor() {
    super('The file content does not match the extension.');
  }
}
