import { EmailChangeTokenEntity } from "../entities/email-change-token.entity";

export abstract class EmailChangeTokenDataSource {
  abstract createToken(
    userId: string,
    currentEmail: string,
    newEmail: string,
  ): Promise<EmailChangeTokenEntity>;

  abstract findByToken(token: string): Promise<EmailChangeTokenEntity | null>;

  abstract findByUserId(userId: string): Promise<EmailChangeTokenEntity | null>;

  abstract deleteToken(id: string): Promise<boolean>;
}
