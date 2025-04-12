import { Repository } from "typeorm";
import { UserDevice } from "../../../../database/postgres/models/user-device.model";
import { PostgresDatabase } from "../../../../database/postgres/postgres.database";
import { UserDeviceDataSource } from "../../domain/datasources/user-device.datasources";
import { UserDeviceEntity } from "../../domain/entities/user-device.entity";
import { CustomError } from "../../../../domain/errors/errors";

export class PostgresUserDeviceDataSourceImpl implements UserDeviceDataSource {
  private readonly userDeviceRepository: Repository<UserDevice>;

  constructor() {
    this.userDeviceRepository =
      PostgresDatabase.appDataSource.getRepository(UserDevice);
  }

  async findByUserIdAndFingerprint(
    userId: string,
    fingerprint: string,
  ): Promise<UserDeviceEntity | null> {
    try {
      const device = await this.userDeviceRepository.findOne({
        where: { userId, fingerprint },
      });

      if (!device) return null;

      return new UserDeviceEntity(
        device.id,
        device.userId,
        device.deviceName,
        device.deviceType,
        device.browser,
        device.operatingSystem,
        device.ipAddress,
        device.fingerprint,
        device.isTrusted,
        device.lastUsedAt,
        device.createdAt,
      );
    } catch (error) {
      console.error("Error finding user device:", error);
      throw CustomError.internalServerError();
    }
  }

  async findDevicesByUserId(userId: string): Promise<UserDeviceEntity[]> {
    try {
      const devices = await this.userDeviceRepository.find({
        where: { userId },
        order: { lastUsedAt: "DESC" },
      });

      return devices.map(
        (device) =>
          new UserDeviceEntity(
            device.id,
            device.userId,
            device.deviceName,
            device.deviceType,
            device.browser,
            device.operatingSystem,
            device.ipAddress,
            device.fingerprint,
            device.isTrusted,
            device.lastUsedAt,
            device.createdAt,
          ),
      );
    } catch (error) {
      console.error("Error finding user devices:", error);
      throw CustomError.internalServerError();
    }
  }

  async createDevice(
    userId: string,
    fingerprint: string,
    deviceName: string | null,
    deviceType: string | null,
    browser: string | null,
    operatingSystem: string | null,
    ipAddress: string | null,
  ): Promise<UserDeviceEntity> {
    try {
      const device = this.userDeviceRepository.create({
        userId,
        fingerprint,
        deviceName,
        deviceType,
        browser,
        operatingSystem,
        ipAddress,
        isTrusted: false,
      });

      const savedDevice = await this.userDeviceRepository.save(device);

      return new UserDeviceEntity(
        savedDevice.id,
        savedDevice.userId,
        savedDevice.deviceName,
        savedDevice.deviceType,
        savedDevice.browser,
        savedDevice.operatingSystem,
        savedDevice.ipAddress,
        savedDevice.fingerprint,
        savedDevice.isTrusted,
        savedDevice.lastUsedAt,
        savedDevice.createdAt,
      );
    } catch (error) {
      console.error("Error creating user device:", error);
      throw CustomError.internalServerError();
    }
  }

  async updateDeviceLastUsed(
    id: string,
    ipAddress: string | null,
  ): Promise<UserDeviceEntity> {
    try {
      const device = await this.userDeviceRepository.findOne({
        where: { id },
      });

      if (!device) {
        throw CustomError.notFound("Device not found");
      }

      device.ipAddress = ipAddress;
      device.lastUsedAt = new Date();

      const updatedDevice = await this.userDeviceRepository.save(device);

      return new UserDeviceEntity(
        updatedDevice.id,
        updatedDevice.userId,
        updatedDevice.deviceName,
        updatedDevice.deviceType,
        updatedDevice.browser,
        updatedDevice.operatingSystem,
        updatedDevice.ipAddress,
        updatedDevice.fingerprint,
        updatedDevice.isTrusted,
        updatedDevice.lastUsedAt,
        updatedDevice.createdAt,
      );
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      console.error("Error updating device last used:", error);
      throw CustomError.internalServerError();
    }
  }

  async trustDevice(id: string): Promise<UserDeviceEntity> {
    try {
      const device = await this.userDeviceRepository.findOne({
        where: { id },
      });

      if (!device) {
        throw CustomError.notFound("Device not found");
      }

      device.isTrusted = true;

      const updatedDevice = await this.userDeviceRepository.save(device);

      return new UserDeviceEntity(
        updatedDevice.id,
        updatedDevice.userId,
        updatedDevice.deviceName,
        updatedDevice.deviceType,
        updatedDevice.browser,
        updatedDevice.operatingSystem,
        updatedDevice.ipAddress,
        updatedDevice.fingerprint,
        updatedDevice.isTrusted,
        updatedDevice.lastUsedAt,
        updatedDevice.createdAt,
      );
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      console.error("Error trusting device:", error);
      throw CustomError.internalServerError();
    }
  }

  async removeDevice(id: string): Promise<boolean> {
    try {
      const result = await this.userDeviceRepository.delete(id);
      return result.affected ? result.affected > 0 : false;
    } catch (error) {
      console.error("Error removing device:", error);
      throw CustomError.internalServerError();
    }
  }
}
