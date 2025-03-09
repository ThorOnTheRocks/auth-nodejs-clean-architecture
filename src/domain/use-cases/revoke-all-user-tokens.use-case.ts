import { CustomError } from "../errors/errors";
import { RefreshTokenRepository } from "../repository/refresh-token.repository";

interface RevokeAllUserTokensUseCase {
  execute(userId: string): Promise<boolean>
}

export class RevokeAllUserTokens implements RevokeAllUserTokensUseCase {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository
  ) {}

  async execute(userId: string): Promise<boolean> {
    try {      
      return await this.refreshTokenRepository.revokeAllUserTokens(userId);
    } catch (error) {
      if(error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServerError('Error revoking all user tokens.')
    }
  }
}