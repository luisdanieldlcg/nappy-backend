import { FileInterceptor } from '@nestjs/platform-express';
import { saveImage } from '../helpers/image-upload';
export class CardImageUploadInterceptor extends FileInterceptor(
  'backgroundImage',
  saveImage,
) {}
