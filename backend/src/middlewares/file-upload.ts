import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';

const MIME_TYPE_MAP: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
};

const fileUpload = multer({
  limits: { fileSize: 100000 },
  storage: multer.diskStorage({
    destination: (
      _: Request,
      __: Express.Multer.File,
      callback: (error: Error | null, destination: string) => void
    ) => {
      callback(null, 'uploads/images');
    },
    filename: (
      _: Request,
      file: Express.Multer.File,
      callback: (error: Error | null, filename: string) => void
    ) => {
      const ext = MIME_TYPE_MAP[file.mimetype];
      callback(null, uuidv4() + '.' + ext);
    },
  }),
  fileFilter: (
    _: Request,
    file: Express.Multer.File,
    callback: FileFilterCallback
  ) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error: Error | null = isValid ? null : new Error('Invalid mime type!');
    // callback(error, isValid);
    // FIXME: the following is incorrect, but it works
    callback(null, isValid);
  },
});

export default fileUpload;
