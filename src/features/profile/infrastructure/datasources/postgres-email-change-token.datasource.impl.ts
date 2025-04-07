import { Repository } from "typeorm";
import { EmailChangeToken } from "../../../../database/postgres/models/emailChangeToken.model";
import { EmailChangeTokenDataSource } from "../../domain/datasources/email-change-token.datasource";
import { EmailChangeTokenEntity } from "../../domain/entities/email-change-token.entity";
import { PostgresDatabase } from "../../../../database/postgres/postgres.database";
import { CustomError } from "../../../../domain/errors/errors";
import { v4 as uuidv4 } from "uuid";

export class PostgresEmailChangeTokenDataSourceImpl
  implements EmailChangeTokenDataSource
{
  private readonly emailChangeTokenRepository: Repository<EmailChangeToken>;

  constructor() {
    this.emailChangeTokenRepository =
      PostgresDatabase.appDataSource.getRepository(EmailChangeToken);
  }

  async createToken(
    userId: string,
    currentEmail: string,
    newEmail: string,
  ): Promise<EmailChangeTokenEntity> {
    try {
      // Delete any existing tokens for this user
      await this.emailChangeTokenRepository.delete({ userId });

      // Generate a token
      const token = uuidv4();

      // Set expiry to 24 hours from now
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      // Create and save the token
      const emailChangeToken = this.emailChangeTokenRepository.create({
        userId,
        currentEmail,
        newEmail,
        token,
        expiresAt,
      });

      const savedToken =
        await this.emailChangeTokenRepository.save(emailChangeToken);

      return new EmailChangeTokenEntity(
        savedToken.id,
        savedToken.userId,
        savedToken.currentEmail,
        savedToken.newEmail,
        savedToken.token,
        savedToken.expiresAt,
        savedToken.createdAt,
      );
    } catch (error) {
      console.error("Error creating email change token:", error);
      throw CustomError.internalServerError();
    }
  }

  async findByToken(token: string): Promise<EmailChangeTokenEntity | null> {
    try {
      const emailChangeToken = await this.emailChangeTokenRepository.findOne({
        where: { token },
      });

      if (!emailChangeToken) return null;

      return new EmailChangeTokenEntity(
        emailChangeToken.id,
        emailChangeToken.userId,
        emailChangeToken.currentEmail,
        emailChangeToken.newEmail,
        emailChangeToken.token,
        emailChangeToken.expiresAt,
        emailChangeToken.createdAt,
      );
    } catch (error) {
      console.error("Error finding email change token:", error);
      throw CustomError.internalServerError();
    }
  }

  async findByUserId(userId: string): Promise<EmailChangeTokenEntity | null> {
    try {
      const emailChangeToken = await this.emailChangeTokenRepository.findOne({
        where: { userId },
      });

      if (!emailChangeToken) return null;

      return new EmailChangeTokenEntity(
        emailChangeToken.id,
        emailChangeToken.userId,
        emailChangeToken.currentEmail,
        emailChangeToken.newEmail,
        emailChangeToken.token,
        emailChangeToken.expiresAt,
        emailChangeToken.createdAt,
      );
    } catch (error) {
      console.error("Error finding email change token by user ID:", error);
      throw CustomError.internalServerError();
    }
  }

  async deleteToken(id: string): Promise<boolean> {
    try {
      const result = await this.emailChangeTokenRepository.delete(id);
      return result.affected ? result.affected > 0 : false;
    } catch (error) {
      console.error("Error deleting email change token:", error);
      throw CustomError.internalServerError();
    }
  }
}
