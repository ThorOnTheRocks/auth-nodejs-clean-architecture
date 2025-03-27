import { PostgresDatabase } from "./postgres/postgres.database";
import { MongoDatabase } from "./mongodb/mongo-database";
import { envs } from "../config/envs";

interface DatabaseConnector {
  connect: () => Promise<void>;
}

export const databaseConnectors: Record<string, DatabaseConnector> = {
  postgres: {
    connect: async () => {
      await PostgresDatabase.connect({
        username: envs.POSTGRES_USER,
        password: envs.POSTGRES_PASSWORD,
        database: envs.POSTGRES_DB,
        host: envs.POSTGRES_HOST,
        port: envs.POSTGRES_LOCAL_PORT,
      });
    },
  },
  mongodb: {
    connect: async () => {
      await MongoDatabase.connect({
        url: envs.MONGO_DB_URL_LOCAL,
        dbName: envs.MONGO_DB_NAME_LOCAL,
      });
    },
  },
};

export const connectToDatabase = async (
  databaseType: string,
): Promise<void> => {
  const connector = databaseConnectors[databaseType];

  if (!connector) {
    throw new Error(`Unsupported database type: ${databaseType}`);
  }

  await connector.connect();
  console.log(`Connected to ${databaseType} database successfully`);
};
