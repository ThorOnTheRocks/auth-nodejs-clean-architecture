import { OauthProvider } from "../../entities/authMethod.entity";

export class LinkAccountDTO {
  private constructor(
    public userId: string,
    public provider: OauthProvider,
    public providerUserId: string,
    public email?: string,
    
  ) {}

  static create(object: {[key: string]: any}): [string?, LinkAccountDTO?] {
    const { userId, provider, providerUserId, email } = object;

    if(!userId) return ["User ID is missing"];
    if(!provider) return ["OAuth provider is missing"];
    if(!providerUserId) return ["Provider user ID is missing"];
    
    return [undefined, new LinkAccountDTO(
      userId,
      provider,
      providerUserId,
      email
    )]
  }
}