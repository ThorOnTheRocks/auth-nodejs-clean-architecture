import { PasswordResetTokenDataSource } from "../../domain/datasources/password-reset-token.datasource";
import { PasswordResetTokenEntity } from "../../domain/entities/passwordResetToken.entity";
import { PasswordResetTokenRepository } from "../../domain/repositories/password-reset-token.repository";

export class PasswordResetTokenRepositoryImpl
  implements PasswordResetTokenRepository
{
  constructor(
    private readonly passwordResetTokenDataSource: PasswordResetTokenDataSource,
  ) {}

  createToken(userId: string): Promise<PasswordResetTokenEntity> {
    return this.passwordResetTokenDataSource.createToken(userId);
  }

  findByToken(token: string): Promise<PasswordResetTokenEntity | null> {
    return this.passwordResetTokenDataSource.findByToken(token);
  }

  markTokenAsUsed(id: string): Promise<boolean> {
    return this.passwordResetTokenDataSource.markTokenAsUsed(id);
  }

  deleteAllUserTokens(userId: string): Promise<boolean> {
    return this.passwordResetTokenDataSource.deleteAllUserTokens(userId);
  }
}
