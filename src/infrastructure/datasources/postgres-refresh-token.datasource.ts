import { LessThan, Repository } from "typeorm";
import { RefreshToken } from "../../data/postgres/models/refreshToken.model";
import { CustomError, RefreshTokenDataSource } from "../../domain";
import { RefreshTokenEntity } from "../../domain/entities/refreshToken.entity";
import { PostgresDatabase } from "../../data/postgres/postgres.database";
import { v4 as uuidv4 } from "uuid";
import { PostgresRefreshTokenMapper } from "../mappers/postgres-refreshToken.mapper";

export class PostgresRefreshTokenDataSourceImpl
  implements RefreshTokenDataSource
{
  private readonly refreshTokenRepository: Repository<RefreshToken>;

  constructor() {
    this.refreshTokenRepository =
      PostgresDatabase.appDataSource.getRepository(RefreshToken);
  }
  async create(
    userId: string,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<RefreshTokenEntity> {
    try {
      const token = uuidv4();

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const refreshToken = this.refreshTokenRepository.create({
        userId,
        token,
        expiresAt,
        isRevoked: false,
        userAgent,
        ipAddress,
      });

      const savedToken = await this.refreshTokenRepository.save(refreshToken);

      return PostgresRefreshTokenMapper.toEntity(savedToken);
    } catch (error) {
      console.error("Error creating refresh token:", error);
      throw CustomError.internalServerError("Failed to create refresh token");
    }
  }

  async findByToken(token: string): Promise<RefreshTokenEntity | null> {
    try {
      const storedToken = await this.refreshTokenRepository.findOne({
        where: { token },
      });

      if (!storedToken) return null;

      return PostgresRefreshTokenMapper.toEntity(storedToken);
    } catch (error) {
      console.error("Error finding refresh token:", error);
      throw CustomError.internalServerError();
    }
  }

  async findAllByUserId(userId: string): Promise<RefreshTokenEntity[]> {
    try {
      const tokens = await this.refreshTokenRepository.find({
        where: { userId },
      });

      return tokens.map((token) => PostgresRefreshTokenMapper.toEntity(token));
    } catch (error) {
      console.error("Error finding refresh tokens by user ID:", error);
      throw CustomError.internalServerError();
    }
  }

  async revokeToken(id: string): Promise<boolean> {
    try {
      const result = await this.refreshTokenRepository.update(id, {
        isRevoked: true,
      });

      return result.affected ? result.affected > 0 : false;
    } catch (error) {
      console.error("Error revoking token:", error);
      throw CustomError.internalServerError();
    }
  }

  async revokeAllUserTokens(userId: string): Promise<boolean> {
    try {
      const result = await this.refreshTokenRepository.update(
        { userId },
        { isRevoked: true },
      );

      return result.affected ? result.affected > 0 : false;
    } catch (error) {
      console.error("Error revoking tokens of user:", error);
      throw CustomError.internalServerError();
    }
  }

  async removeExpiredTokens(): Promise<number> {
    try {
      const now = new Date();
      const result = await this.refreshTokenRepository.delete({
        expiresAt: LessThan(now),
      });

      return result.affected || 0;
    } catch (error) {
      console.error("Error removing expired tokens:", error);
      throw CustomError.internalServerError();
    }
  }
}
