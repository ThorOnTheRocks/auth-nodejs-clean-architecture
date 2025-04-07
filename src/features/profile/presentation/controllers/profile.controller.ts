import { Request, Response } from "express";
import { CustomError } from "../../../../domain/errors/errors";
import { UpdateProfileImage } from "../../domain/use-cases/update-profile-image.use-case.ts";
import { GetProfileImage } from "../../domain/use-cases/get-profile-image.use-case";
import { FileStorageRepository } from "../../domain/repositories/file-storage.repository";
import { UserRepository } from "../../../auth/domain/repositories/user.repository";
import { UpdateProfile } from "../../domain/use-cases/update-profile.use-case";
import { VerifyEmailChange } from "../../domain/use-cases/verify-email-change.use-case";
import { EmailChangeTokenRepository } from "../../domain/repositories/email-change-token.repository";
import { EmailRepository } from "../../../email/domain/repositories/email.repository";
import { UpdateProfileDTO } from "../../domain/dtos/update-profile.dto";
import { GetPendingEmailChange } from "../../domain/use-cases/get-pending-email-change.use-case";

export class ProfileController {
  constructor(
    private readonly fileStorageRepository: FileStorageRepository,
    private readonly userRepository: UserRepository,
    private readonly emailChangeTokenRepository: EmailChangeTokenRepository,
    private readonly emailRepository: EmailRepository,
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

      const [error, updateProfileDTO] = UpdateProfileDTO.create({
        userId,
        name,
        email,
      });

      if (error) {
        res.status(400).json({ error });
        return;
      }

      const user = await new UpdateProfile(
        this.userRepository,
        this.emailChangeTokenRepository,
        this.emailRepository,
      ).execute(updateProfileDTO!);

      // Check if there's a pending email change
      const pendingEmailChange = await new GetPendingEmailChange(
        this.emailChangeTokenRepository,
      ).execute(userId);

      // Return the response
      const safeUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        img: user.img,
        roles: user.role,
        isVerified: user.isVerified,
        pendingEmailChange: pendingEmailChange?.newEmail,
      };

      res.json({
        success: true,
        message: pendingEmailChange
          ? "Profile updated. Please verify your new email address."
          : "Profile updated successfully.",
        user: safeUser,
      });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  verifyEmailChange = async (req: Request, res: Response): Promise<void> => {
    try {
      const { token } = req.query;

      if (!token || typeof token !== "string") {
        res.status(400).json({ error: "Token is required" });
        return;
      }

      const user = await new VerifyEmailChange(
        this.emailChangeTokenRepository,
        this.userRepository,
      ).execute(token);

      res.json({
        success: true,
        message: "Email address has been updated successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          isVerified: user.isVerified,
        },
      });
    } catch (error) {
      this.handleError(error, res);
    }
  };
}
