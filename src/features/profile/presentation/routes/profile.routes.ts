import { Router } from "express";
import { ProfileController } from "../controllers/profile.controller";
import { AuthMiddleware } from "../../../auth/presentation/middlewares/auth.middleware";
import { DatabaseFactory } from "../../../../infrastructure/factories/database.factory";
import { UserRepositoryImpl } from "../../../auth/infrastructure/repositories/user.repository.impl";
import { FileStorageRepositoryImpl } from "../../infrastructure/repositories/file-storage.repository.impl";
import { envs } from "../../../../config/envs";
import { MulterAdapter } from "../../../../config/multer";

export class ProfileRoutes {
  static get routes(): Router {
    const router = Router();

    // Create dependencies
    const userDataSource = DatabaseFactory.createUserDataSource(
      envs.DATABASE_TYPE,
    );
    const fileStorageDataSource = DatabaseFactory.createFileStorageDataSource();

    const userRepository = new UserRepositoryImpl(userDataSource);
    const fileStorageRepository = new FileStorageRepositoryImpl(
      fileStorageDataSource,
    );

    // Create controller
    const controller = new ProfileController(
      fileStorageRepository,
      userRepository,
    );

    // Configure image uploader middleware
    const imageUploader = MulterAdapter.imageUploader("image", {
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    });

    // Define routes
    router.get("/me", [AuthMiddleware.validateJWT], controller.getMyProfile);

    router.put("/me", [AuthMiddleware.validateJWT], controller.updateProfile);

    router.post(
      "/image",
      [AuthMiddleware.validateJWT, imageUploader],
      controller.updateProfileImage,
    );

    router.get(
      "/image",
      [AuthMiddleware.validateJWT],
      controller.getProfileImage,
    );

    router.get("/image/:userId", controller.getProfileImage);

    return router;
  }
}
