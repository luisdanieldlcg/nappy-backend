import { FileInterceptor } from '@nestjs/platform-express';
import { saveImage } from '../helpers/image-upload';

// Will throw unexpected field error if the file field has another name
export class CardImageUploadInterceptor extends FileInterceptor(
  'coverImage',
  saveImage,
) {}
