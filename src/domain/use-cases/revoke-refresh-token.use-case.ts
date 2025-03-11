import { CustomError } from "../errors/errors";
import { RefreshTokenRepository } from "../repository/refresh-token.repository";

interface RevokeRefreshTokenUseCase {
  execute(token: string): Promise<boolean>
}

export class RevokeRefreshToken implements RevokeRefreshTokenUseCase {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository
  ) {}

  async execute(token: string): Promise<boolean> {
    try {
      const refreshToken = await this.refreshTokenRepository.findByToken(token);
      
      if (!refreshToken) {
        throw CustomError.notFound('Refresh token not found');
      }      
      
      return await this.refreshTokenRepository.revokeToken(refreshToken.id);
    } catch (error) {
      if(error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServerError('Error revoking refresh token.')
    }
  }
}