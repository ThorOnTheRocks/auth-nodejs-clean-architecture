import multer, { Options, StorageEngine, FileFilterCallback } from "multer";
import { Request, RequestHandler } from "express";

export interface MulterOptions extends Options {
  storage?: StorageEngine;
  limits?: {
    fieldNameSize?: number;
    fieldSize?: number;
    fields?: number;
    fileSize?: number;
    files?: number;
    parts?: number;
    headerPairs?: number;
  };
  preservePath?: boolean;
}

export class MulterAdapter {
  static configureUpload(options: MulterOptions = {}): multer.Multer {
    const defaultOptions: MulterOptions = {
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit by default
      },
    };

    const mergedOptions = { ...defaultOptions, ...options };

    return multer(mergedOptions);
  }

  static imageFileFilter(): (
    req: Request,
    file: Express.Multer.File,
    callback: FileFilterCallback,
  ) => void {
    return (req, file, callback) => {
      if (!file.mimetype.startsWith("image/")) {
        return callback(new Error("Only image files are allowed"));
      }
      callback(null, true);
    };
  }

  static imageUploader(
    fieldName: string = "image",
    options: MulterOptions = {},
  ): RequestHandler {
    const imageOptions: MulterOptions = {
      ...options,
      fileFilter: this.imageFileFilter(),
    };

    return this.configureUpload(imageOptions).single(fieldName);
  }
}
