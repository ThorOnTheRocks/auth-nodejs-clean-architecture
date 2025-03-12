import { get } from 'env-var';
import * as dotenv from 'dotenv';

dotenv.config({path: './.env.development'});


export const envs = {
  PORT: get('PORT').required().asPortNumber(),
  MONGO_DB_URL_LOCAL: get('MONGO_DB_URL_LOCAL').required().asString(),
  MONGO_DB_NAME_LOCAL: get('MONGO_DB_NAME_LOCAL').required().asString(),
  JWT_SECRET: get('JWT_SECRET').required().asString(),
  POSTGRES_PASSWORD: get('POSTGRES_PASSWORD').required().asString(),
  POSTGRES_USER: get('POSTGRES_USER').required().asString(),
  POSTGRES_DB: get('POSTGRES_DB').required().asString(),
  POSTGRES_LOCAL_PORT: get('POSTGRES_LOCAL_PORT').required().asInt(),
  POSTGRES_HOST: get('POSTGRES_HOST').required().asString(),
  DATABASE_TYPE: get('DATABASE_TYPE').default('postgres').asEnum(['postgres', 'mongodb']),
  GOOGLE_CLIENT_ID: get('GOOGLE_CLIENT_ID').required().asString(),
  GOOGLE_CLIENT_SECRET: get('GOOGLE_CLIENT_SECRET').required().asString(),
  GOOGLE_CALLBACK_URL: get('GOOGLE_CALLBACK_URL').required().asString(),
  GITHUB_CLIENT_ID: get('GITHUB_CLIENT_ID').required().asString(),
  GITHUB_CLIENT_SECRET: get('GITHUB_CLIENT_SECRET').required().asString(),
  GITHUB_CALLBACK_URL: get('GITHUB_CALLBACK_URL').required().asString(),
}

