import { PasswordResetTokenEntity } from "../entities/passwordResetToken.entity";

export abstract class PasswordResetTokenDataSource {
  abstract createToken(userId: string): Promise<PasswordResetTokenEntity>;
  abstract findByToken(token: string): Promise<PasswordResetTokenEntity | null>;
  abstract markTokenAsUsed(id: string): Promise<boolean>;
  abstract deleteAllUserTokens(userId: string): Promise<boolean>;
}
