import { FileStorageRepository } from "../repositories/file-storage.repository";
import { UserRepository } from "../../../auth/domain/repositories/user.repository";
import { CustomError } from "../../../../domain/errors/errors";
import { FileMetadata } from "../datasources/file-storage.datasource";
import { v4 as uuidv4 } from "uuid";

interface UpdateProfileImageUseCase {
  execute(
    userId: string,
    file: Buffer,
    mimetype: string,
    filename: string,
  ): Promise<FileMetadata>;
}

export class UpdateProfileImage implements UpdateProfileImageUseCase {
  constructor(
    private readonly fileStorageRepository: FileStorageRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(
    userId: string,
    file: Buffer,
    mimetype: string,
    filename: string,
  ): Promise<FileMetadata> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw CustomError.notFound("User not found");
      }

      if (!mimetype.startsWith("image/")) {
        throw CustomError.badRequest("Only image files are allowed");
      }

      const extension = filename.substring(filename.lastIndexOf("."));
      const uniqueFilename = `${userId}-${uuidv4()}${extension}`;

      if (user.img && !user.img.includes("oauth-profile")) {
        const oldFilename = user.img.substring(user.img.lastIndexOf("/") + 1);
        await this.fileStorageRepository.deleteFile(
          oldFilename,
          "profile-images",
        );
      }

      const savedFile = await this.fileStorageRepository.saveFile(
        file,
        uniqueFilename,
        mimetype,
        "profile-images",
      );

      user.img = savedFile.url;
      await this.userRepository.updateUser(user);

      return savedFile;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServerError("Error updating profile image");
    }
  }
}
