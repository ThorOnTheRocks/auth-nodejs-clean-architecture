import fs from "fs";
import path from "path";
import {
  FileMetadata,
  FileStorageDataSource,
} from "../../domain/datasources/file-storage.datasource";
import { CustomError } from "../../../../domain/errors/errors";
import { envs } from "../../../../config/envs";

export class LocalFileStorageDataSource implements FileStorageDataSource {
  private readonly baseDir: string;
  private readonly baseUrl: string;

  constructor() {
    this.baseDir = path.join(process.cwd(), "uploads");
    this.baseUrl =
      envs.FILE_STORAGE_URL || `http://localhost:${envs.PORT}/uploads`;
    this.ensureDirectoryExists(this.baseDir);
  }

  private ensureDirectoryExists(directory: string): void {
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
  }

  async saveFile(
    file: Buffer | Uint8Array,
    filename: string,
    mimetype: string,
    folder: string = "default",
  ): Promise<FileMetadata> {
    try {
      const folderPath = path.join(this.baseDir, folder);
      this.ensureDirectoryExists(folderPath);

      const filePath = path.join(folderPath, filename);
      await fs.promises.writeFile(filePath, file);

      const url = `${this.baseUrl}/${folder}/${filename}`;
      const stats = await fs.promises.stat(filePath);

      return {
        filename,
        mimetype,
        size: stats.size,
        path: filePath,
        url,
      };
    } catch (error) {
      console.error("Error saving file:", error);
      throw CustomError.internalServerError("Error saving file");
    }
  }

  getFileUrl(filename: string, folder: string = "default"): string {
    return `${this.baseUrl}/${folder}/${filename}`;
  }

  async deleteFile(
    filename: string,
    folder: string = "default",
  ): Promise<boolean> {
    try {
      const filePath = path.join(this.baseDir, folder, filename);
      if (!fs.existsSync(filePath)) {
        return false;
      }

      await fs.promises.unlink(filePath);
      return true;
    } catch (error) {
      console.error("Error deleting file:", error);
      return false;
    }
  }

  async fileExists(
    filename: string,
    folder: string = "default",
  ): Promise<boolean> {
    const filePath = path.join(this.baseDir, folder, filename);
    return fs.existsSync(filePath);
  }
}
