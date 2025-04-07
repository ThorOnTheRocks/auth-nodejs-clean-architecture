// src/features/profile/infrastructure/repositories/email-change-token.repository.impl.ts
import { EmailChangeTokenDataSource } from "../../domain/datasources/email-change-token.datasource";
import { EmailChangeTokenEntity } from "../../domain/entities/email-change-token.entity";
import { EmailChangeTokenRepository } from "../../domain/repositories/email-change-token.repository";

export class EmailChangeTokenRepositoryImpl
  implements EmailChangeTokenRepository
{
  constructor(
    private readonly emailChangeTokenDataSource: EmailChangeTokenDataSource,
  ) {}

  createToken(
    userId: string,
    currentEmail: string,
    newEmail: string,
  ): Promise<EmailChangeTokenEntity> {
    return this.emailChangeTokenDataSource.createToken(
      userId,
      currentEmail,
      newEmail,
    );
  }

  findByToken(token: string): Promise<EmailChangeTokenEntity | null> {
    return this.emailChangeTokenDataSource.findByToken(token);
  }

  findByUserId(userId: string): Promise<EmailChangeTokenEntity | null> {
    return this.emailChangeTokenDataSource.findByUserId(userId);
  }

  deleteToken(id: string): Promise<boolean> {
    return this.emailChangeTokenDataSource.deleteToken(id);
  }
}
