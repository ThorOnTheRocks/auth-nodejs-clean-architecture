import {
  AuthDataSource,
  CustomError,
  RefreshTokenDataSource,
} from "../../domain";
import { FileStorageDataSource } from "../../features/profile/domain/datasources/file-storage.datasource";
import { OAuthDatasource } from "../../features/oauth/domain/datasources/oauth.datasource";
import { UserDataSource } from "../../features/auth/domain/datasources/user.datasource";
import { LocalFileStorageDataSource } from "../../features/profile/infrastructure/datasources/local-file-storage.datasource.impl";
import { MongoAuthDataSourceImpl } from "../../features/auth/infrastructure/datasources/mongo-auth.datasource.impl";
import { PostgresAuthDataSourceImpl } from "../../features/auth/infrastructure/datasources/postgres-auth.datasources.impl";
import { PostgresOAuthDatasourceImpl } from "../../features/oauth/infrastructure/datasources/postgres-oauth.datasource.impl";
import { PostgresRefreshTokenDataSourceImpl } from "../../features/token/infrastructure/datasources/postgres-refresh-token.datasource";
import { PostgresUserDataSourceImpl } from "../../features/auth/infrastructure/datasources/postgres-user.datasource.impl";

export type DatabaseType = "postgres" | "mongodb";

export class DatabaseFactory {
  static createAuthDataSource(type: DatabaseType): AuthDataSource {
    switch (type) {
      case "postgres":
        return new PostgresAuthDataSourceImpl();
      case "mongodb":
        return new MongoAuthDataSourceImpl();
      default:
        throw CustomError.internalServerError(
          `Unsupported database type: ${type}`,
        );
    }
  }

  static createRefreshTokenDataSource(
    type: DatabaseType,
  ): RefreshTokenDataSource {
    switch (type) {
      case "postgres":
        return new PostgresRefreshTokenDataSourceImpl();
      default:
        throw CustomError.internalServerError(
          `Unsupported database type: ${type}`,
        );
    }
  }

  static createUserDataSource(type: DatabaseType): UserDataSource {
    switch (type) {
      case "postgres":
        return new PostgresUserDataSourceImpl();
      default:
        throw CustomError.internalServerError(
          `Unsupported database type: ${type}`,
        );
    }
  }

  static createOAuthDataSource(type: DatabaseType): OAuthDatasource {
    switch (type) {
      case "postgres":
        return new PostgresOAuthDatasourceImpl();
      default:
        throw CustomError.internalServerError(
          `Unsupported database type: ${type} for OAuth`,
        );
    }
  }

  static createFileStorageDataSource(): FileStorageDataSource {
    return new LocalFileStorageDataSource();
  }
}
