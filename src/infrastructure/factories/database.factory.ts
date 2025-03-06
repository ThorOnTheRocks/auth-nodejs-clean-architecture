import { AuthDataSource, CustomError } from "../../domain";
import { MongoAuthDataSourceImpl } from "../datasources/mongo-auth.datasource.impl";
import { PostgresAuthDataSourceImpl } from "../datasources/postgres-auth.datasources.impl";


export type DatabaseType = 'postgres' | 'mongodb';


export class DatabaseFactory {
  static createAuthDataSource(type: DatabaseType): AuthDataSource {
    switch(type) {
      case 'postgres':
        return new PostgresAuthDataSourceImpl();
      case 'mongodb':
        return new MongoAuthDataSourceImpl();
      default:
        throw CustomError.internalServerError(`Unsupported database type: ${type}`)
    }
  };
}