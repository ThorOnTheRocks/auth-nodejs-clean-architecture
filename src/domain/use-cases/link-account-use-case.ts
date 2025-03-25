import { AuthMethodEntity } from "../entities/authMethod.entity";
import { CustomError } from "../errors/errors";
import { OAuthRepository } from "../repository/oauth.repository";
import { LinkAccountDTO } from "../dtos/auth/link-account.dto";

interface LinkOAuthAccountUseCase {
  execute(linkAccountDTO: LinkAccountDTO): Promise<AuthMethodEntity>;
}

export class LinkOAuthAccount implements LinkOAuthAccountUseCase {
  constructor(private readonly oauthRepository: OAuthRepository) {}

  async execute(linkAccountDTO: LinkAccountDTO): Promise<AuthMethodEntity> {
    try {
      return await this.oauthRepository.linkOAuthToUser(
        linkAccountDTO.userId,
        linkAccountDTO.provider,
        {
          id: linkAccountDTO.providerUserId,
          email: linkAccountDTO.email,
        },
      );
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServerError("Failed to link OAuth account");
    }
  }
}
