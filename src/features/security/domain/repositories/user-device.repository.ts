import { UserDeviceEntity } from "../entities/user-device.entity";

export abstract class UserDeviceRepository {
  abstract findByUserIdAndFingerprint(
    userId: string,
    fingerprint: string,
  ): Promise<UserDeviceEntity | null>;

  abstract findDevicesByUserId(userId: string): Promise<UserDeviceEntity[]>;

  abstract createDevice(
    userId: string,
    fingerprint: string,
    deviceName: string | null,
    deviceType: string | null,
    browser: string | null,
    operatingSystem: string | null,
    ipAddress: string | null,
  ): Promise<UserDeviceEntity>;

  abstract updateDeviceLastUsed(
    id: string,
    ipAddress: string | null,
  ): Promise<UserDeviceEntity>;

  abstract trustDevice(id: string): Promise<UserDeviceEntity>;

  abstract removeDevice(id: string): Promise<boolean>;
}
