import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import multer, { diskStorage } from 'multer';
import { v4 as uuid_v4 } from 'uuid';
import { from, Observable, of, switchMap } from 'rxjs';
import { FileTypeResult, fromFile } from 'file-type';
import { unlinkSync } from 'fs';

// Type definitions
type SupportedFileExtension = 'png' | 'jpg' | 'jpeg';
type SupportedMimeType = 'image/png' | 'image/jpg' | 'image/jpeg';
const allowedExtensions: SupportedFileExtension[] = ['png', 'jpg', 'jpeg'];
const allowedMimeTypes: SupportedMimeType[] = [
  'image/png',
  'image/jpg',
  'image/jpeg',
];
export const saveImage: MulterOptions = {
  storage: diskStorage({
    destination: './public/images/',
    filename: (req, file, cb) => {
      const extension = file.mimetype.split('/')[1];
      const fileName = uuid_v4() + '.' + extension;
      console.log('Saving image: ' + fileName);
      cb(null, fileName);
    },
  }),
  fileFilter: async (
    req: Express.Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback,
  ) => {
    // Do not allow other mime types
    return allowedMimeTypes.includes(file.mimetype as SupportedMimeType)
      ? cb(null, true)
      : cb(null, false);
  },
};

/**
 * Will check if the given file matches its extension
 * @param path
 * @returns Whether the file is legit
 */
export const fileMatchesExtension = (path: string): Observable<boolean> => {
  return from(fromFile(path)).pipe(
    switchMap((result: FileTypeResult) => {
      if (!result) {
        return of(false);
      }
      const ext = result.ext as SupportedFileExtension;
      const mime = result.mime as SupportedMimeType;
      if (!ext || !mime) return of(false);
      const hasValidFileType = allowedExtensions.includes(ext);
      const hasValidMimeType = allowedMimeTypes.includes(mime);
      return of(hasValidFileType && hasValidMimeType);
    }),
  );
};
export const removeFile = (path: string): void => {
  try {
    unlinkSync(path);
  } catch (error) {
    console.log('Got an error: ', error);
  }
};
