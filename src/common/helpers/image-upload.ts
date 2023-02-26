import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { Request } from 'express';
import multer, { diskStorage } from 'multer';
import { v4 as uuid_v4 } from 'uuid';
import path from 'path';
import { from, map, Observable, of, switchMap } from 'rxjs';
import { fileTypeFromFile, FileTypeResult } from 'file-type';

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
    destination: './images',
    filename: (req, file, cb) => {
      const fileName = uuid_v4() + path.extname(file.originalname);
      cb(null, fileName);
    },
  }),
  fileFilter: (
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

export const fileMatchesExtension = (
  absolutePath: string,
): Observable<boolean> => {
  return from(fileTypeFromFile(absolutePath)).pipe(
    switchMap((result: FileTypeResult) => {
      if (!result) {
        return of(false);
      }
      // const hasValidFileType = allowedExtensions.includes(supportedExt);
      // const hasValidMimeType = allowedMimeTypes.includes(supportedExt);
      // const isLegitFile = allowedExtensions.includes(supportedExt);
      // return of(isLegitFile);
    }),
  );
};
