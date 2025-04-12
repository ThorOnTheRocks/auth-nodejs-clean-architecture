import { Router } from "express";
import { DeviceController } from "../controllers/device.controller";
import { AuthMiddleware } from "../../../auth/presentation/middlewares/auth.middleware";
import { DatabaseFactory } from "../../../../infrastructure/factories/database.factory";
import { UserDeviceRepositoryImpl } from "../../infrastructure/repositories/user-device.repository.impl";
import { envs } from "../../../../config/envs";

export class DeviceRoutes {
  static get routes(): Router {
    const router = Router();

    const userDeviceDataSource = DatabaseFactory.createUserDeviceDataSource(
      envs.DATABASE_TYPE,
    );

    const userDeviceRepository = new UserDeviceRepositoryImpl(
      userDeviceDataSource,
    );

    const controller = new DeviceController(userDeviceRepository);

    // Device management routes
    router.get("/", [AuthMiddleware.validateJWT], controller.getUserDevices);

    router.post(
      "/:deviceId/trust",
      [AuthMiddleware.validateJWT],
      controller.trustDevice,
    );

    router.delete(
      "/:deviceId",
      [AuthMiddleware.validateJWT],
      controller.removeDevice,
    );

    return router;
  }
}
