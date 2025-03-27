import { FileMetadata } from "../../domain/datasources/file-storage.datasource";
import { FileStorageRepository } from "../../domain/repositories/file-storage.repository";
import { FileStorageDataSource } from "../../domain/datasources/file-storage.datasource";

export class FileStorageRepositoryImpl implements FileStorageRepository {
  constructor(private readonly fileStorageDataSource: FileStorageDataSource) {}

  saveFile(
    file: Buffer | Uint8Array,
    filename: string,
    mimetype: string,
    folder?: string,
  ): Promise<FileMetadata> {
    return this.fileStorageDataSource.saveFile(
      file,
      filename,
      mimetype,
      folder,
    );
  }

  getFileUrl(filename: string, folder?: string): string {
    return this.fileStorageDataSource.getFileUrl(filename, folder);
  }

  deleteFile(filename: string, folder?: string): Promise<boolean> {
    return this.fileStorageDataSource.deleteFile(filename, folder);
  }

  fileExists(filename: string, folder?: string): Promise<boolean> {
    return this.fileStorageDataSource.fileExists(filename, folder);
  }
}
