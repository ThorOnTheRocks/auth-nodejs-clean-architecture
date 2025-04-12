import { Request, Response } from "express";
import { CustomError } from "../../../../domain/errors/errors";
import { UserDeviceRepository } from "../../domain/repositories/user-device.repository";
import { GetUserDevices } from "../../domain/use-cases/get-user-device.use-case";
import { TrustDevice } from "../../domain/use-cases/trust-device.use-case";
import { RemoveDevice } from "../../domain/use-cases/remove-device.use-case";

export class DeviceController {
  constructor(private readonly userDeviceRepository: UserDeviceRepository) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  };

  getUserDevices = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.body.user.id;

      const devices = await new GetUserDevices(
        this.userDeviceRepository,
      ).execute(userId);

      res.json({
        devices: devices.map((device) => ({
          id: device.id,
          deviceName: device.deviceName || "Unknown device",
          deviceType: device.deviceType,
          browser: device.browser,
          operatingSystem: device.operatingSystem,
          ipAddress: device.ipAddress,
          isTrusted: device.isTrusted,
          lastUsedAt: device.lastUsedAt,
          createdAt: device.createdAt,
        })),
      });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  trustDevice = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.body.user.id;
      const { deviceId } = req.params;

      const device = await new TrustDevice(this.userDeviceRepository).execute(
        deviceId,
        userId,
      );

      res.json({
        success: true,
        message: "Device has been trusted",
        device: {
          id: device.id,
          deviceName: device.deviceName || "Unknown device",
          isTrusted: device.isTrusted,
        },
      });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  removeDevice = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.body.user.id;
      const { deviceId } = req.params;

      const success = await new RemoveDevice(this.userDeviceRepository).execute(
        deviceId,
        userId,
      );

      if (success) {
        res.json({
          success: true,
          message: "Device has been removed",
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Failed to remove device",
        });
      }
    } catch (error) {
      this.handleError(error, res);
    }
  };
}
