import { UserDeviceEntity } from "../entities/user-device.entity";
import { UserDeviceRepository } from "../repositories/user-device.repository";
import { CustomError } from "../../../../domain/errors/errors";

interface TrustDeviceUseCase {
  execute(deviceId: string, userId: string): Promise<UserDeviceEntity>;
}

export class TrustDevice implements TrustDeviceUseCase {
  constructor(private readonly userDeviceRepository: UserDeviceRepository) {}

  async execute(deviceId: string, userId: string): Promise<UserDeviceEntity> {
    try {
      // Get the device to verify ownership
      const devices =
        await this.userDeviceRepository.findDevicesByUserId(userId);
      const targetDevice = devices.find((device) => device.id === deviceId);

      if (!targetDevice) {
        throw CustomError.notFound(
          "Device not found or does not belong to user",
        );
      }

      return await this.userDeviceRepository.trustDevice(deviceId);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServerError("Error trusting device");
    }
  }
}
