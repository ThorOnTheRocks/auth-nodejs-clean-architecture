import { JWTExpiration } from "../../config";
import { CustomError } from "../errors/errors";
import { RefreshTokenRepository } from "../repository/refresh-token.repository";
import { UserRepository } from "../repository/user.repository";
import { UserToken } from "./types";

interface RefreshAccessTokenUseCase {
  execute(refreshToken: string): Promise<UserToken>;
}

export class RefreshAccessToken implements RefreshAccessTokenUseCase {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly userRepository: UserRepository,
    private readonly signToken: (
      payload: object,
      duration?: JWTExpiration,
    ) => Promise<string | null>,
  ) {}

  async execute(refreshToken: string): Promise<UserToken> {
    try {
      const storedToken =
        await this.refreshTokenRepository.findByToken(refreshToken);

      if (!storedToken) throw CustomError.unAuthorized("Invalid refresh token");
      if (storedToken.isRevoked)
        throw CustomError.unAuthorized("Refresh token has been revoked");
      if (new Date() > storedToken.expiresAt)
        throw CustomError.unAuthorized("Refresh token has expired");

      const user = await this.userRepository.findById(storedToken.userId);
      if (!user) throw CustomError.unAuthorized("User not found");

      const token = await this.signToken({ id: storedToken.userId }, "2h");
      if (!token)
        throw CustomError.internalServerError("Error generating access token");

      return {
        token,
        user: {
          id: storedToken.userId,
          name: user.name,
          email: user.email,
        },
      };
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServerError("Error refreshing access token.");
    }
  }
}
