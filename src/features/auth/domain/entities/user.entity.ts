export class UserEntity {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public password: string,
    public role: string[],
    public isVerified: boolean = false,
    public img?: string,
    public isLocked: boolean = false,
    public lockedUntil: Date | null = null,
    public lockReason: string | null = null,
  ) {}
}
