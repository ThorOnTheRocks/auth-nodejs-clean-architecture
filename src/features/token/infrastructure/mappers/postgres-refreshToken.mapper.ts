import { RefreshTokenEntity } from "../../domain/entities/refreshToken.entity";
import { RefreshToken } from "../../../../database/postgres/models/refreshToken.model";
import { CustomError } from "../../../../domain";

export class PostgresRefreshTokenMapper {
  static toEntity(postgresRefreshToken: RefreshToken): RefreshTokenEntity {
    const {
      id,
      userId,
      token,
      expiresAt,
      isRevoked,
      createdAt,
      userAgent,
      ipAddress,
    } = postgresRefreshToken;

    if (!id) throw CustomError.badRequest("Missing id");
    if (!userId) throw CustomError.badRequest("Missing userId");
    if (!token) throw CustomError.badRequest("Missing token");
    if (!expiresAt) throw CustomError.badRequest("Missing expiresAt");

    return new RefreshTokenEntity(
      id,
      userId,
      token,
      expiresAt,
      isRevoked,
      createdAt,
      userAgent,
      ipAddress,
    );
  }
}
