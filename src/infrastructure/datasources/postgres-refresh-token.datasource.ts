import { Repository } from "typeorm";
import { RefreshToken } from "../../data/postgres/models/refreshToken.model";
import { CustomError, RefreshTokenDataSource } from "../../domain";
import { RefreshTokenEntity } from "../../domain/entities/refreshToken.entity";
import { PostgresDatabase } from "../../data/postgres/postgres.database";
import { v4 as uuidv4 } from 'uuid';
import { PostgresRefreshTokenMapper } from "../mappers/postgres-refreshToken.mapper";



export class PostgresRefreshTokenDataSourceImpl implements RefreshTokenDataSource {
  private readonly refreshTokenRepository: Repository<RefreshToken>
  
  constructor() {
    this.refreshTokenRepository = PostgresDatabase.appDataSource.getRepository(RefreshToken);
  }
  async create(userId: string, userAgent?: string, ipAddress?: string): Promise<RefreshTokenEntity> {
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
        ipAddress
      })

      const savedToken = await this.refreshTokenRepository.save(refreshToken);

      return PostgresRefreshTokenMapper.toEntity(savedToken);
    } catch (error) {
      console.error('Error creating refresh token:', error);
      throw CustomError.internalServerError('Failed to create refresh token');
    }
  }
  findByToken(token: string): Promise<RefreshTokenEntity | null> {
    throw new Error("Method not implemented.");
  }
  findAllByUserId(userId: string): Promise<RefreshTokenEntity[]> {
    throw new Error("Method not implemented.");
  }
  revokeToken(id: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  revokeAllUserTokens(userId: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  removeExpiredTokens(): Promise<number> {
    throw new Error("Method not implemented.");
  }

}