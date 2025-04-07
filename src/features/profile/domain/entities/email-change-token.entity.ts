export class EmailChangeTokenEntity {
  constructor(
    public id: string,
    public userId: string,
    public currentEmail: string,
    public newEmail: string,
    public token: string,
    public expiresAt: Date,
    public createdAt: Date,
  ) {}
}
