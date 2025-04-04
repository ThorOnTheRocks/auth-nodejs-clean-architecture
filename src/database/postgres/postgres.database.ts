import { DataSource } from "typeorm";
import { User } from "./models/user.model";
import { RefreshToken } from "./models/refreshToken.model";
import { AuthMethod } from "./models/authMethod.model";

interface Options {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export class PostgresDatabase {
  static appDataSource: DataSource;

  static async connect(options: Options) {
    const { host, port, username, password, database } = options;

    try {
      this.appDataSource = new DataSource({
        type: "postgres",
        host,
        port,
        username,
        password,
        database,
        entities: [User, RefreshToken, AuthMethod],
        synchronize: true,
        logging: true,
      });

      await this.appDataSource.initialize();
      console.log("Postgres connected successfully!");
    } catch (error) {
      console.error("Postgres connection error:", error);
      throw error;
    }
  }
}
