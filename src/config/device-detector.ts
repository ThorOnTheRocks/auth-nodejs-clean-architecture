import * as UAParserLib from "ua-parser-js";
import crypto from "crypto";

const UAParser = UAParserLib.UAParser;

export interface DeviceInfo {
  fingerprint: string;
  deviceName: string | null;
  deviceType: string | null;
  browser: string | null;
  operatingSystem: string | null;
}

export class DeviceDetectorAdapter {
  static detectDevice(
    userAgent: string | null,
    ip: string | null,
    userId: string,
  ): DeviceInfo {
    const parsedInfo = this.parseUserAgent(userAgent);
    const fingerprint = this.generateFingerprint(userAgent, ip, userId);

    return {
      fingerprint,
      deviceName: parsedInfo.deviceName || null,
      deviceType: parsedInfo.deviceType || null,
      browser: parsedInfo.browser || null,
      operatingSystem: parsedInfo.operatingSystem || null,
    };
  }

  private static parseUserAgent(userAgent: string | null): Partial<DeviceInfo> {
    if (!userAgent) {
      return {
        deviceName: null,
        deviceType: null,
        browser: null,
        operatingSystem: null,
      };
    }

    const parser = UAParser(userAgent);
    const device = parser.device;
    const browser = parser.browser;
    const os = parser.os;

    return {
      deviceName: device.model || device.vendor || null,
      deviceType: device.type || "desktop",
      browser: browser.name || null,
      operatingSystem: os.name || null,
    };
  }

  private static generateFingerprint(
    userAgent: string | null,
    ip: string | null,
    userId: string,
  ): string {
    const baseString = `${userAgent || ""}|${ip || ""}|${userId}`;
    return crypto.createHash("sha256").update(baseString).digest("hex");
  }
}
