import { RefreshTokenEntity } from "../entities/refreshToken.entity";
import { CustomError } from "../errors/errors";
import { RefreshTokenRepository } from "../repository/refresh-token.repository";

interface GenerateRefreshTokenUseCase {
  execute(
    userId: string,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<RefreshTokenEntity>;
}

export class GenerateRefreshToken implements GenerateRefreshTokenUseCase {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async execute(
    userId: string,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<RefreshTokenEntity> {
    try {
      return await this.refreshTokenRepository.create(
        userId,
        userAgent,
        ipAddress,
      );
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServerError("Error generating refresh token.");
    }
  }
}
