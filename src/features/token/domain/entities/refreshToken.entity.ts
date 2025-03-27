export class RefreshTokenEntity {
  constructor(
    public id: string,
    public userId: string,
    public token: string,
    public expiresAt: Date,
    public isRevoked: boolean,
    public createdAt: Date,
    public userAgent?: string,
    public ipAddress?: string,
  ) {}
}
