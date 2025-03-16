import {
  AuthDataSource,
  CustomError,
  RefreshTokenDataSource,
} from "../../domain";
import { UserDataSource } from "../../domain/datasources/user.datasource";
import { MongoAuthDataSourceImpl } from "../datasources/mongo-auth.datasource.impl";
import { PostgresAuthDataSourceImpl } from "../datasources/postgres-auth.datasources.impl";
import { PostgresRefreshTokenDataSourceImpl } from "../datasources/postgres-refresh-token.datasource";
import { PostgresUserDataSourceImpl } from "../datasources/postgres-user.datasource.impl";

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
}
