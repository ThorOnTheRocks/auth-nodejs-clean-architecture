export type OauthProvider = "local" | "google" | "github";

export class AuthMethodEntity {
  constructor(
    public id: string,
    public userId: string,
    public provider: OauthProvider,
    public email?: string,
    public metadata?: Record<string, unknown>,
  ) {}
}
