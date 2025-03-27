import { OauthMethodEntity } from "../entities/oauthMethod.entity";
import { CustomError } from "../../../../domain/errors/errors";
import { OAuthRepository } from "../repositories/oauth.repository";
import { LinkAccountDTO } from "../dtos/link-account.dto";

interface LinkOAuthAccountUseCase {
  execute(linkAccountDTO: LinkAccountDTO): Promise<OauthMethodEntity>;
}

export class LinkOAuthAccount implements LinkOAuthAccountUseCase {
  constructor(private readonly oauthRepository: OAuthRepository) {}

  async execute(linkAccountDTO: LinkAccountDTO): Promise<OauthMethodEntity> {
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
