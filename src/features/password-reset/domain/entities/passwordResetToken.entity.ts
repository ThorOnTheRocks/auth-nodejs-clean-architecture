export class PasswordResetTokenEntity {
  constructor(
    public id: string,
    public userId: string,
    public token: string,
    public expiresAt: Date,
    public isUsed: boolean,
    public createdAt: Date,
  ) {}
}
