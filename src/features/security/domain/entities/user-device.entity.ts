export class UserDeviceEntity {
  constructor(
    public id: string,
    public userId: string,
    public deviceName: string | null,
    public deviceType: string | null,
    public browser: string | null,
    public operatingSystem: string | null,
    public ipAddress: string | null,
    public fingerprint: string,
    public isTrusted: boolean,
    public lastUsedAt: Date,
    public createdAt: Date,
  ) {}
}
