import { VerificationTokenDataSource } from "../../domain/datasources/verification-token.datasource";
import { VerificationTokenEntity } from "../../domain/entities/verificationToken.entity";
import { VerificationTokenRepository } from "../../domain/repositories/verification-token.repository";

export class VerificationTokenRepositoryImpl
  implements VerificationTokenRepository
{
  constructor(
    private readonly verificationTokenDataSource: VerificationTokenDataSource,
  ) {}

  createToken(userId: string): Promise<VerificationTokenEntity> {
    return this.verificationTokenDataSource.createToken(userId);
  }

  findByToken(token: string): Promise<VerificationTokenEntity | null> {
    return this.verificationTokenDataSource.findByToken(token);
  }

  deleteToken(id: string): Promise<boolean> {
    return this.verificationTokenDataSource.deleteToken(id);
  }

  deleteAllUserTokens(userId: string): Promise<boolean> {
    return this.verificationTokenDataSource.deleteAllUserTokens(userId);
  }
}
