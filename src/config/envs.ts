import { get } from 'env-var';
import * as dotenv from 'dotenv';

dotenv.config();


export const envs = {
  PORT: get('PORT').required().asPortNumber(),
  MONGO_DB_URL_LOCAL: get('MONGO_DB_URL_LOCAL').required().asString(),
  MONGO_DB_NAME_LOCAL: get('MONGO_DB_NAME_LOCAL').required().asString(),
  JWT_SECRET: get('JWT_SECRET').required().asString()
}

