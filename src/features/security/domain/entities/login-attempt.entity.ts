export class LoginAttemptEntity {
  constructor(
    public id: string,
    public email: string,
    public userId: string | null,
    public ipAddress: string | null,
    public userAgent: string | null,
    public success: boolean,
    public createdAt: Date,
  ) {}
}
