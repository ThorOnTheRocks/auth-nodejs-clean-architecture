import { UserDeviceEntity } from "../entities/user-device.entity";
import { UserDeviceRepository } from "../repositories/user-device.repository";
import { CustomError } from "../../../../domain/errors/errors";

interface GetUserDevicesUseCase {
  execute(userId: string): Promise<UserDeviceEntity[]>;
}

export class GetUserDevices implements GetUserDevicesUseCase {
  constructor(private readonly userDeviceRepository: UserDeviceRepository) {}

  async execute(userId: string): Promise<UserDeviceEntity[]> {
    try {
      return await this.userDeviceRepository.findDevicesByUserId(userId);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServerError("Error retrieving user devices");
    }
  }
}
