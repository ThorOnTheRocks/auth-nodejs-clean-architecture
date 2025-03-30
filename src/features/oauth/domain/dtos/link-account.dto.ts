import { OauthProvider } from "../entities/oauthMethod.entity";

interface LinkAccountDTOProps {
  userId: string;
  provider: string;
  providerUserId: string;
  email?: string;
  [key: string]: unknown;
}

export class LinkAccountDTO {
  private constructor(
    public userId: string,
    public provider: OauthProvider,
    public providerUserId: string,
    public email?: string,
  ) {}

  static create(object: LinkAccountDTOProps): [string?, LinkAccountDTO?] {
    const { userId, provider, providerUserId, email } = object;

    if (!userId) return ["User ID is missing"];
    if (!provider) return ["OAuth provider is missing"];
    if (!providerUserId) return ["Provider user ID is missing"];

    if (!["local", "google", "github"].includes(provider)) {
      return ["Provider must be one of: local, google, github"];
    }

    return [
      undefined,
      new LinkAccountDTO(
        userId,
        provider as OauthProvider,
        providerUserId,
        email,
      ),
    ];
  }
}
