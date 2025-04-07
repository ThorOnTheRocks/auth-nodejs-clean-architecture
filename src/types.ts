import { JWTExpiration } from "./config";

export interface UserToken {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    isVerified?: boolean;
  };
}

export type SignToken = (
  payload: object,
  duration: JWTExpiration,
) => Promise<string | null>;
