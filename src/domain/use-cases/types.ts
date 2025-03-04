import { JWTExpiration } from "../../config"

export interface UserToken {
  token: string,
  user: {
    id: string,
    name: string,
    email: string
  }
}

export type SignToken = (payload: Object, duration: JWTExpiration) => Promise<string | null>
