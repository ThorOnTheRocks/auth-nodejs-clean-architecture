import { Request, Response } from "express";
import { CustomError } from "../../../../domain/errors/errors";
import { UpdateProfileImage } from "../../domain/use-cases/update-profile-image.use-case.ts";
import { GetProfileImage } from "../../domain/use-cases/get-profile-image.use-case";
import { FileStorageRepository } from "../../domain/repositories/file-storage.repository";
import { UserRepository } from "../../../auth/domain/repositories/user.repository";

export class ProfileController {
  constructor(
    private readonly fileStorageRepository: FileStorageRepository,
    private readonly userRepository: UserRepository,
  ) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  };

  updateProfileImage = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.body.user.id;
      const file = req.file;

      if (!file) {
        res.status(400).json({ error: "No file uploaded" });
        return;
      }

      const updateProfileImage = new UpdateProfileImage(
        this.fileStorageRepository,
        this.userRepository,
      );

      const result = await updateProfileImage.execute(
        userId,
        file.buffer,
        file.mimetype,
        file.originalname,
      );

      res.status(200).json({
        message: "Profile image updated successfully",
        imageUrl: result.url,
      });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  getProfileImage = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.userId || req.body.user.id;

      const getProfileImage = new GetProfileImage(this.userRepository);
      const imageUrl = await getProfileImage.execute(userId);

      res.status(200).json({
        imageUrl,
      });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  getMyProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.body.user.id;
      const user = await this.userRepository.findById(userId);

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const safeUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        img: user.img,
        roles: user.role,
      };

      res.status(200).json({ user: safeUser });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.body.user.id;
      const { name, email } = req.body;

      const user = await this.userRepository.findById(userId);
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      if (name) user.name = name;
      if (email) user.email = email;

      const updatedUser = await this.userRepository.updateUser(user);

      const safeUser = {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        img: updatedUser.img,
        roles: updatedUser.role,
      };

      res.status(200).json({
        message: "Profile updated successfully",
        user: safeUser,
      });
    } catch (error) {
      this.handleError(error, res);
    }
  };
}
