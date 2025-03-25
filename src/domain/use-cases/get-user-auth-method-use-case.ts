import { AuthMethodDTO } from "../dtos/auth/auth-method.dto";
import { CustomError } from "../errors/errors";
import { OAuthRepository } from "../repository/oauth.repository";

interface GetUserAuthMethodsUseCase {
  execute(userId: string): Promise<AuthMethodDTO[]>;
}

export class GetUserAuthMethods implements GetUserAuthMethodsUseCase {
  constructor(private readonly oauthRepository: OAuthRepository) {}

  async execute(userId: string): Promise<AuthMethodDTO[]> {
    try {
      const authMethods =
        await this.oauthRepository.findAuthMethodsByUserId(userId);
      return authMethods.map((method) => AuthMethodDTO.create(method));
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServerError("Failed to retrieve auth methods");
    }
  }
}
