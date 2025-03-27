import {
  RefreshTokenDataSource,
  RefreshTokenRepository,
} from "../../../../domain";
import { RefreshTokenEntity } from "../../domain/entities/refreshToken.entity";

export class RefreshTokenRepositoryImpl implements RefreshTokenRepository {
  constructor(
    private readonly refreshTokenDataSource: RefreshTokenDataSource,
  ) {}

  create(
    userId: string,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<RefreshTokenEntity> {
    return this.refreshTokenDataSource.create(userId, userAgent, ipAddress);
  }
  findByToken(token: string): Promise<RefreshTokenEntity | null> {
    return this.refreshTokenDataSource.findByToken(token);
  }
  findAllByUserId(userId: string): Promise<RefreshTokenEntity[]> {
    return this.refreshTokenDataSource.findAllByUserId(userId);
  }
  revokeToken(id: string): Promise<boolean> {
    return this.refreshTokenDataSource.revokeToken(id);
  }
  revokeAllUserTokens(userId: string): Promise<boolean> {
    return this.refreshTokenDataSource.revokeAllUserTokens(userId);
  }
  removeExpiredTokens(): Promise<number> {
    return this.refreshTokenDataSource.removeExpiredTokens();
  }
}
