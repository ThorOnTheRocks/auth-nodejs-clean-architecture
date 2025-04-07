import { Repository } from "typeorm";
import { PasswordResetToken } from "../../../../database/postgres/models/passwordResetToken.model";
import { PasswordResetTokenDataSource } from "../../domain/datasources/password-reset-token.datasource";
import { PasswordResetTokenEntity } from "../../domain/entities/passwordResetToken.entity";
import { PostgresDatabase } from "../../../../database/postgres/postgres.database";
import { CustomError } from "../../../../domain/errors/errors";
import { v4 as uuidv4 } from "uuid";

export class PostgresPasswordResetTokenDataSourceImpl
  implements PasswordResetTokenDataSource
{
  private readonly passwordResetTokenRepository: Repository<PasswordResetToken>;

  constructor() {
    this.passwordResetTokenRepository =
      PostgresDatabase.appDataSource.getRepository(PasswordResetToken);
  }

  async createToken(userId: string): Promise<PasswordResetTokenEntity> {
    try {
      // Generate a token (using UUID)
      const token = uuidv4();

      // Set expiry to 1 hour from now
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1);

      // Create and save the token
      const passwordResetToken = this.passwordResetTokenRepository.create({
        userId,
        token,
        expiresAt,
        isUsed: false,
      });

      const savedToken =
        await this.passwordResetTokenRepository.save(passwordResetToken);

      return new PasswordResetTokenEntity(
        savedToken.id,
        savedToken.userId,
        savedToken.token,
        savedToken.expiresAt,
        savedToken.isUsed,
        savedToken.createdAt,
      );
    } catch (error) {
      console.error("Error creating password reset token:", error);
      throw CustomError.internalServerError();
    }
  }

  async findByToken(token: string): Promise<PasswordResetTokenEntity | null> {
    try {
      const passwordResetToken =
        await this.passwordResetTokenRepository.findOne({
          where: { token },
        });

      if (!passwordResetToken) return null;

      return new PasswordResetTokenEntity(
        passwordResetToken.id,
        passwordResetToken.userId,
        passwordResetToken.token,
        passwordResetToken.expiresAt,
        passwordResetToken.isUsed,
        passwordResetToken.createdAt,
      );
    } catch (error) {
      console.error("Error finding password reset token:", error);
      throw CustomError.internalServerError();
    }
  }

  async markTokenAsUsed(id: string): Promise<boolean> {
    try {
      const result = await this.passwordResetTokenRepository.update(id, {
        isUsed: true,
      });

      return result.affected ? result.affected > 0 : false;
    } catch (error) {
      console.error("Error marking password reset token as used:", error);
      throw CustomError.internalServerError();
    }
  }

  async deleteAllUserTokens(userId: string): Promise<boolean> {
    try {
      const result = await this.passwordResetTokenRepository.delete({ userId });

      return result.affected ? result.affected > 0 : false;
    } catch (error) {
      console.error("Error deleting user password reset tokens:", error);
      throw CustomError.internalServerError();
    }
  }
}
