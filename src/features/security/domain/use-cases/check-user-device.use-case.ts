import { UserDeviceEntity } from "../entities/user-device.entity";
import { UserDeviceRepository } from "../repositories/user-device.repository";
import { CustomError } from "../../../../domain/errors/errors";
import { EmailRepository } from "../../../email/domain/repositories/email.repository";
import { UserRepository } from "../../../auth/domain/repositories/user.repository";
import { DeviceInfo } from "../../../../config/device-detector";
import { SecurityLoggerService } from "../../application/security-logger.service";
import { SecurityEventType } from "../entities/security-event.entity";

interface CheckUserDeviceUseCase {
  execute(
    userId: string,
    deviceInfo: DeviceInfo,
    ipAddress: string | null,
  ): Promise<{ isNewDevice: boolean; device: UserDeviceEntity }>;
}

export class CheckUserDevice implements CheckUserDeviceUseCase {
  constructor(
    private readonly userDeviceRepository: UserDeviceRepository,
    private readonly userRepository: UserRepository,
    private readonly emailRepository: EmailRepository,
  ) {}

  async execute(
    userId: string,
    deviceInfo: DeviceInfo,
    ipAddress: string | null,
  ): Promise<{ isNewDevice: boolean; device: UserDeviceEntity }> {
    try {
      // Check if device is already known for this user
      const existingDevice =
        await this.userDeviceRepository.findByUserIdAndFingerprint(
          userId,
          deviceInfo.fingerprint,
        );

      if (existingDevice) {
        // Update the last used timestamp and IP
        const updatedDevice =
          await this.userDeviceRepository.updateDeviceLastUsed(
            existingDevice.id,
            ipAddress,
          );

        return { isNewDevice: false, device: updatedDevice };
      }

      // This is a new device, create it
      const newDevice = await this.userDeviceRepository.createDevice(
        userId,
        deviceInfo.fingerprint,
        deviceInfo.deviceName,
        deviceInfo.deviceType,
        deviceInfo.browser,
        deviceInfo.operatingSystem,
        ipAddress,
      );

      // Log the new device login
      SecurityLoggerService.getInstance().logEvent(
        userId,
        SecurityEventType.NEW_DEVICE_LOGIN,
        ipAddress,
        null,
        {
          deviceInfo: {
            deviceName: deviceInfo.deviceName,
            deviceType: deviceInfo.deviceType,
            browser: deviceInfo.browser,
            operatingSystem: deviceInfo.operatingSystem,
          },
        },
      );

      // Send notification email about new device
      await this.sendNewDeviceEmail(userId, deviceInfo, ipAddress);

      return { isNewDevice: true, device: newDevice };
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServerError("Error checking user device");
    }
  }

  private async sendNewDeviceEmail(
    userId: string,
    deviceInfo: DeviceInfo,
    ipAddress: string | null,
  ): Promise<void> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        console.error("User not found for sending new device email");
        return;
      }

      const deviceDetails = [
        deviceInfo.deviceName ? `Device: ${deviceInfo.deviceName}` : null,
        deviceInfo.deviceType ? `Type: ${deviceInfo.deviceType}` : null,
        deviceInfo.browser ? `Browser: ${deviceInfo.browser}` : null,
        deviceInfo.operatingSystem ? `OS: ${deviceInfo.operatingSystem}` : null,
        ipAddress ? `IP Address: ${ipAddress}` : null,
      ]
        .filter(Boolean)
        .join("<br>");

      const now = new Date();
      const formattedDate = now.toLocaleDateString();
      const formattedTime = now.toLocaleTimeString();

      await this.emailRepository.sendEmail({
        to: user.email,
        subject: "Security Alert: New Device Login",
        html: `
          <h1>New Login from Unrecognized Device</h1>
          <p>Dear ${user.name},</p>
          <p>We detected a login to your account from a device we don't recognize.</p>
          <p><strong>Date:</strong> ${formattedDate} at ${formattedTime}</p>
          <div>${deviceDetails}</div>
          <p>If this was you, you can ignore this message. Your account is secure.</p>
          <p>If you don't recognize this activity, please change your password immediately and contact support.</p>
        `,
      });
    } catch (error) {
      console.error("Error sending new device email:", error);
      // Don't throw - we don't want failed email to block authentication
    }
  }
}
