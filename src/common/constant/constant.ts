/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { join } from 'path';

import { diskStorage } from 'multer';
import { extname } from 'path';
import { UnsupportedMediaTypeException } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';

export const FILE_UPLOAD_SETTINGS = {
  LIMIT: 10 * 1024 * 1024,
  PATH: 'uploads',
  SRC: 'src',
};

export const FILE_UPLOAD_DEST = join(
  process.cwd(),
  FILE_UPLOAD_SETTINGS.SRC,
  FILE_UPLOAD_SETTINGS.PATH,
);

if (!existsSync(FILE_UPLOAD_DEST)) {
  mkdirSync(FILE_UPLOAD_DEST, { recursive: true });
}

const ALLOWED_MIME_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/gif': ['.gif'],
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
    '.docx',
  ],
  'application/zip': ['.zip'],
  'application/x-zip-compressed': ['.zip'],
};

export const multerOptions = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      if (!existsSync(FILE_UPLOAD_DEST)) {
        mkdirSync(FILE_UPLOAD_DEST, { recursive: true });
      }
      cb(null, FILE_UPLOAD_DEST);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(
        null,
        `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
      );
    },
  }),
  limits: {
    fileSize: FILE_UPLOAD_SETTINGS.LIMIT,
    files: 10, // Maximum total files per request
    fields: 10, // Maximum non-file fields
    fieldNameSize: 100, // Maximum field name size
    fieldSize: 1024 * 1024, // Maximum field value size (1MB)
  },

  fileFilter: (req, file, cb) => {
    try {
      const fileExtension = extname(file.originalname).toLowerCase();
      const mimeType = file.mimetype.toLowerCase();
      // Check if MIME type is allowed
      const allowedExtensions = ALLOWED_MIME_TYPES[mimeType];
      if (!allowedExtensions) {
        return cb(
          new UnsupportedMediaTypeException(
            `Unsupported file type: ${file.mimetype}. Allowed types: ${Object.keys(ALLOWED_MIME_TYPES).join(', ')}`,
          ),
          false,
        );
      }
      // Check if file extension matches MIME type
      if (!allowedExtensions.includes(fileExtension)) {
        return cb(
          new UnsupportedMediaTypeException(
            `File extension ${fileExtension} doesn't match MIME type ${file.mimetype}`,
          ),
          false,
        );
      }
      // Additional security check for file size
      if (file.size && file.size > FILE_UPLOAD_SETTINGS.LIMIT) {
        return cb(
          new UnsupportedMediaTypeException(
            `File size exceeds limit of ${FILE_UPLOAD_SETTINGS.LIMIT / (1024 * 1024)}MB`,
          ),
          false,
        );
      }
      cb(null, true);
    } catch (error: any) {
      cb(
        new UnsupportedMediaTypeException(
          `File validation error: ${error.message}`,
        ),
        false,
      );
    }
  },
  // fileFilter: (req, file, cb) => {
  //   const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|zip/;
  //   const extName = allowedTypes.test(extname(file.originalname).toLowerCase());
  //   const mimeType = allowedTypes.test(file.mimetype);

  //   if (mimeType && extName) {
  //     return cb(null, true);
  //   } else {
  //     cb(
  //       new UnsupportedMediaTypeException(
  //         `Only specific file types are allowed! Received: ${file.mimetype}`,
  //       ),
  //     );
  //   }
  // },
};

export const fileNameAndSizeMixUpload = (
  filesName: string = 'files',
  fileName: string = 'file',
  numberOfFiles: number = 3,
  numberOfFile: number = 1,
) => {
  // Validate parameters
  if (numberOfFiles < 0 || numberOfFile < 0) {
    throw new Error('File counts must be non-negative');
  }

  if (numberOfFiles > 10 || numberOfFile > 10) {
    throw new Error('Maximum file count per field is 10');
  }

  return [
    { name: filesName, maxCount: numberOfFiles },
    { name: fileName, maxCount: numberOfFile },
  ];
};

// Export type for better TypeScript support
export interface UploadedFilesType {
  [fieldname: string]: Express.Multer.File[];
}

// Helper function to validate uploaded files
export const validateUploadedFiles = (files: UploadedFilesType): boolean => {
  if (!files || Object.keys(files).length === 0) {
    return false;
  }

  // Check if at least one file was uploaded
  return Object.values(files).some(
    (fileArray) => fileArray && fileArray.length > 0,
  );
};

// export const fileNameAndSizeMixUpload = (
//   filesName: string = 'files',
//   fileName: string = 'file',
//   numberOfFiles: number = 3,
//   numberOfFile: number = 1,
// ) => {
//   return [
//     { name: filesName, maxCount: numberOfFiles },
//     { name: fileName, maxCount: numberOfFile },
//   ];
// };
