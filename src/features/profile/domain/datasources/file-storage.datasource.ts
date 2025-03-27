export interface FileMetadata {
  filename: string;
  mimetype: string;
  size: number;
  path: string;
  url: string;
}

export abstract class FileStorageDataSource {
  abstract saveFile(
    file: Buffer | Uint8Array,
    filename: string,
    mimetype: string,
    folder?: string,
  ): Promise<FileMetadata>;

  abstract getFileUrl(filename: string, folder?: string): string;

  abstract deleteFile(filename: string, folder?: string): Promise<boolean>;

  abstract fileExists(filename: string, folder?: string): Promise<boolean>;
}
