export type OauthProvider = "local" | "google" | "github";

export class OauthMethodEntity {
  constructor(
    public id: string,
    public userId: string,
    public provider: OauthProvider,
    public email?: string,
    public metadata?: Record<string, unknown>,
  ) {}
}
