import { RefreshTokenEntity } from "../entities/refreshToken.entity";

export abstract class RefreshTokenRepository {
  abstract create(
    userId: string,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<RefreshTokenEntity>;

  abstract findByToken(token: string): Promise<RefreshTokenEntity | null>;

  abstract findAllByUserId(userId: string): Promise<RefreshTokenEntity[]>;

  abstract revokeToken(id: string): Promise<boolean>;

  abstract revokeAllUserTokens(userId: string): Promise<boolean>;

  abstract removeExpiredTokens(): Promise<number>;
}
