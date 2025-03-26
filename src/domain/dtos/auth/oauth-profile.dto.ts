import { OauthProvider } from "../../entities/authMethod.entity";

interface OauthProfileInput {
  name: string;
  email: string;
  oauthProvider: OauthProvider;
  providerId: string;
  picture?: string;
  metadata?: Record<string, unknown>;
  [key: string]: unknown;
}

export class OauthProfileDTO {
  private constructor(
    public name: string,
    public email: string,
    public oauthProvider: OauthProvider,
    public providerId: string,
    public picture?: string,
    public metadata?: Record<string, unknown>,
  ) {}

  static create(object: OauthProfileInput): [string?, OauthProfileDTO?] {
    const { name, email, oauthProvider, providerId, picture, metadata } =
      object;

    if (!name) return ["Name is missing"];
    if (!email) return ["Email is missing"];
    if (!oauthProvider) return ["OAuth provider is missing"];
    if (!providerId) return ["Provider ID is missing"];

    return [
      undefined,
      new OauthProfileDTO(
        name,
        email,
        oauthProvider,
        providerId,
        picture,
        metadata,
      ),
    ];
  }
}
