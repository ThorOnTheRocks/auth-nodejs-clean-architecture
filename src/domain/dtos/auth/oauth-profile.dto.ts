import { OauthProvider } from "../../entities/authMethod.entity";

export class OauthProfileDTO {
  private constructor(
    public name: string,
    public email: string,
    public oauthProvider: OauthProvider,
    public providerId: string,
    public metadata?: string[],
    public picture?: string,
  ) {}

  static create(object: { [key: string]: any }): [string?, OauthProfileDTO?] {
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
