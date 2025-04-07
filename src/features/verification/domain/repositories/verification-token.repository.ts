import { VerificationTokenEntity } from "../entities/verificationToken.entity";

export abstract class VerificationTokenRepository {
  abstract createToken(userId: string): Promise<VerificationTokenEntity>;
  abstract findByToken(token: string): Promise<VerificationTokenEntity | null>;
  abstract deleteToken(id: string): Promise<boolean>;
  abstract deleteAllUserTokens(userId: string): Promise<boolean>;
}
