import { UserDeviceDataSource } from "../../domain/datasources/user-device.datasources";
import { UserDeviceEntity } from "../../domain/entities/user-device.entity";
import { UserDeviceRepository } from "../../domain/repositories/user-device.repository";

export class UserDeviceRepositoryImpl implements UserDeviceRepository {
  constructor(private readonly userDeviceDataSource: UserDeviceDataSource) {}

  findByUserIdAndFingerprint(
    userId: string,
    fingerprint: string,
  ): Promise<UserDeviceEntity | null> {
    return this.userDeviceDataSource.findByUserIdAndFingerprint(
      userId,
      fingerprint,
    );
  }

  findDevicesByUserId(userId: string): Promise<UserDeviceEntity[]> {
    return this.userDeviceDataSource.findDevicesByUserId(userId);
  }

  createDevice(
    userId: string,
    fingerprint: string,
    deviceName: string | null,
    deviceType: string | null,
    browser: string | null,
    operatingSystem: string | null,
    ipAddress: string | null,
  ): Promise<UserDeviceEntity> {
    return this.userDeviceDataSource.createDevice(
      userId,
      fingerprint,
      deviceName,
      deviceType,
      browser,
      operatingSystem,
      ipAddress,
    );
  }

  updateDeviceLastUsed(
    id: string,
    ipAddress: string | null,
  ): Promise<UserDeviceEntity> {
    return this.userDeviceDataSource.updateDeviceLastUsed(id, ipAddress);
  }

  trustDevice(id: string): Promise<UserDeviceEntity> {
    return this.userDeviceDataSource.trustDevice(id);
  }

  removeDevice(id: string): Promise<boolean> {
    return this.userDeviceDataSource.removeDevice(id);
  }
}
