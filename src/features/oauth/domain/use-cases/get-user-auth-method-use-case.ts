import { OauthMethodDTO } from "../dtos/oauth-method.dto";
import { CustomError } from "../../../../domain/errors/errors";
import { OAuthRepository } from "../repositories/oauth.repository";

interface GetUserAuthMethodsUseCase {
  execute(userId: string): Promise<OauthMethodDTO[]>;
}

export class GetUserAuthMethods implements GetUserAuthMethodsUseCase {
  constructor(private readonly oauthRepository: OAuthRepository) {}

  async execute(userId: string): Promise<OauthMethodDTO[]> {
    try {
      const authMethods =
        await this.oauthRepository.findAuthMethodsByUserId(userId);
      return authMethods.map((method) => OauthMethodDTO.create(method));
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServerError("Failed to retrieve auth methods");
    }
  }
}
