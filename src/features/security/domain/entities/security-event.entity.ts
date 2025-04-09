export enum SecurityEventType {
  LOGIN_SUCCESS = "LOGIN_SUCCESS",
  LOGIN_FAILURE = "LOGIN_FAILURE",
  PASSWORD_CHANGE = "PASSWORD_CHANGE",
  PASSWORD_RESET_REQUEST = "PASSWORD_RESET_REQUEST",
  PASSWORD_RESET_COMPLETE = "PASSWORD_RESET_COMPLETE",
  ACCOUNT_LOCKED = "ACCOUNT_LOCKED",
  ACCOUNT_UNLOCKED = "ACCOUNT_UNLOCKED",
  EMAIL_CHANGED = "EMAIL_CHANGED",
  NEW_DEVICE_LOGIN = "NEW_DEVICE_LOGIN",
  SUSPICIOUS_ACTIVITY = "SUSPICIOUS_ACTIVITY",
  ADMIN_ACTION = "ADMIN_ACTION",
  TOKEN_REVOKED = "TOKEN_REVOKED",
}

export class SecurityEventEntity {
  constructor(
    public id: string,
    public userId: string | null,
    public eventType: SecurityEventType,
    public ipAddress: string | null,
    public userAgent: string | null,
    public details: Record<string, unknown> | null,
    public createdAt: Date,
  ) {}
}
