import { get } from 'env-var';
import * as dotenv from 'dotenv';

dotenv.config();


export const envs = {
  PORT: get('PORT').required().asPortNumber(),
  MONGO_DB_URL_LOCAL: get('MONGO_DB_URL_LOCAL').required().asString(),
  MONGO_DB_NAME_LOCAL: get('MONGO_DB_NAME_LOCAL').required().asString(),
  JWT_SECRET: get('JWT_SECRET').required().asString(),
  POSTGRES_PASSWORD: get('POSTGRES_PASSWORD').required().asString(),
  POSTGRES_USER: get('POSTGRES_USER').required().asString(),
  POSTGRES_DB: get('POSTGRES_DB').required().asString(),
  POSTGRES_LOCAL_PORT: get('POSTGRES_LOCAL_PORT').required().asInt(),
  POSTGRES_HOST: get('POSTGRES_HOST').required().asString
}

