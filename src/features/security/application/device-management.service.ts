import { UserDeviceRepository } from "../domain/repositories/user-device.repository";
import { UserRepository } from "../../auth/domain/repositories/user.repository";
import { EmailRepository } from "../../email/domain/repositories/email.repository";
import { CheckUserDevice } from "../domain/use-cases/check-user-device.use-case";
import { DeviceDetectorAdapter } from "../../../config/device-detector";
import { UserDeviceEntity } from "../domain/entities/user-device.entity";

export class DeviceManagementService {
  private static instance: DeviceManagementService;
  private checkUserDevice: CheckUserDevice | null = null;

  private constructor() {}

  public static getInstance(): DeviceManagementService {
    if (!DeviceManagementService.instance) {
      DeviceManagementService.instance = new DeviceManagementService();
    }
    return DeviceManagementService.instance;
  }

  public initialize(
    userDeviceRepository: UserDeviceRepository,
    userRepository: UserRepository,
    emailRepository: EmailRepository,
  ): void {
    this.checkUserDevice = new CheckUserDevice(
      userDeviceRepository,
      userRepository,
      emailRepository,
    );
  }

  public async registerInitialDevice(
    userId: string,
    userAgent: string | null,
    ipAddress: string | null,
  ): Promise<UserDeviceEntity | void> {
    if (!this.checkUserDevice) {
      console.error("DeviceManagementService not initialized");
      return;
    }

    const deviceInfo = DeviceDetectorAdapter.detectDevice(
      userAgent,
      ipAddress,
      userId,
    );

    // Create the device but skip notification
    const result = await this.checkUserDevice.registerInitialDevice(
      userId,
      deviceInfo,
      ipAddress,
    );

    return result;
  }

  public async checkDevice(
    userId: string,
    userAgent: string | null,
    ipAddress: string | null,
  ): Promise<boolean> {
    if (!this.checkUserDevice) {
      console.error("DeviceManagementService not initialized");
      return false;
    }

    const deviceInfo = DeviceDetectorAdapter.detectDevice(
      userAgent,
      ipAddress,
      userId,
    );

    const result = await this.checkUserDevice.execute(
      userId,
      deviceInfo,
      ipAddress,
    );

    return result.isNewDevice;
  }
}
