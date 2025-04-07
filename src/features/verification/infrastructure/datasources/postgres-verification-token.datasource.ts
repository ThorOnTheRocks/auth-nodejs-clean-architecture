import { Repository } from "typeorm";
import { VerificationToken } from "../../../../database/postgres/models/verificationToken.model";
import { VerificationTokenDataSource } from "../../domain/datasources/verification-token.datasource";
import { VerificationTokenEntity } from "../../domain/entities/verificationToken.entity";
import { PostgresDatabase } from "../../../../database/postgres/postgres.database";
import { CustomError } from "../../../../domain/errors/errors";
import { v4 as uuidv4 } from "uuid";

export class PostgresVerificationTokenDataSourceImpl
  implements VerificationTokenDataSource
{
  private readonly verificationTokenRepository: Repository<VerificationToken>;

  constructor() {
    this.verificationTokenRepository =
      PostgresDatabase.appDataSource.getRepository(VerificationToken);
  }

  async createToken(userId: string): Promise<VerificationTokenEntity> {
    try {
      // Generate a token (using UUID)
      const token = uuidv4();

      // Set expiry to 24 hours from now
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      // Create and save the token
      const verificationToken = this.verificationTokenRepository.create({
        userId,
        token,
        expiresAt,
      });

      const savedToken =
        await this.verificationTokenRepository.save(verificationToken);

      return new VerificationTokenEntity(
        savedToken.id,
        savedToken.userId,
        savedToken.token,
        savedToken.expiresAt,
        savedToken.createdAt,
      );
    } catch (error) {
      console.error("Error creating verification token:", error);
      throw CustomError.internalServerError();
    }
  }

  async findByToken(token: string): Promise<VerificationTokenEntity | null> {
    try {
      const verificationToken = await this.verificationTokenRepository.findOne({
        where: { token },
      });

      if (!verificationToken) return null;

      return new VerificationTokenEntity(
        verificationToken.id,
        verificationToken.userId,
        verificationToken.token,
        verificationToken.expiresAt,
        verificationToken.createdAt,
      );
    } catch (error) {
      console.error("Error finding verification token:", error);
      throw CustomError.internalServerError();
    }
  }

  async deleteToken(id: string): Promise<boolean> {
    try {
      const result = await this.verificationTokenRepository.delete(id);
      return result.affected ? result.affected > 0 : false;
    } catch (error) {
      console.error("Error deleting verification token:", error);
      throw CustomError.internalServerError();
    }
  }

  async deleteAllUserTokens(userId: string): Promise<boolean> {
    try {
      const result = await this.verificationTokenRepository.delete({ userId });
      return result.affected ? result.affected > 0 : false;
    } catch (error) {
      console.error("Error deleting user verification tokens:", error);
      throw CustomError.internalServerError();
    }
  }
}
