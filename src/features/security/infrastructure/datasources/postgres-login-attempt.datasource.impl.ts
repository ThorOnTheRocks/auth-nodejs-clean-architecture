import { Repository, LessThan } from "typeorm";
import { LoginAttempt } from "../../../../database/postgres/models/login-attempt.model";
import { PostgresDatabase } from "../../../../database/postgres/postgres.database";
import { LoginAttemptDataSource } from "../../domain/datasources/login-attempt.datasource";
import { LoginAttemptEntity } from "../../domain/entities/login-attempt.entity";
import { CustomError } from "../../../../domain/errors/errors";

export class PostgresLoginAttemptDataSourceImpl
  implements LoginAttemptDataSource
{
  private readonly loginAttemptRepository: Repository<LoginAttempt>;

  constructor() {
    this.loginAttemptRepository =
      PostgresDatabase.appDataSource.getRepository(LoginAttempt);
  }

  async recordAttempt(
    email: string,
    success: boolean,
    userId: string | null,
    ipAddress: string | null,
    userAgent: string | null,
  ): Promise<LoginAttemptEntity> {
    try {
      const loginAttempt = this.loginAttemptRepository.create({
        email,
        success,
        userId,
        ipAddress,
        userAgent,
      });

      const savedAttempt = await this.loginAttemptRepository.save(loginAttempt);

      return new LoginAttemptEntity(
        savedAttempt.id,
        savedAttempt.email,
        savedAttempt.userId,
        savedAttempt.ipAddress,
        savedAttempt.userAgent,
        savedAttempt.success,
        savedAttempt.createdAt,
      );
    } catch (error) {
      console.error("Error recording login attempt:", error);
      throw CustomError.internalServerError("Failed to record login attempt");
    }
  }

  async getRecentAttemptsByEmail(
    email: string,
    minutes: number,
  ): Promise<LoginAttemptEntity[]> {
    try {
      const cutoffTime = new Date(Date.now() - minutes * 60 * 1000);

      const attempts = await this.loginAttemptRepository.find({
        where: {
          email,
          createdAt: LessThan(cutoffTime),
        },
        order: { createdAt: "DESC" },
      });

      return attempts.map(
        (attempt) =>
          new LoginAttemptEntity(
            attempt.id,
            attempt.email,
            attempt.userId,
            attempt.ipAddress,
            attempt.userAgent,
            attempt.success,
            attempt.createdAt,
          ),
      );
    } catch (error) {
      console.error("Error getting recent login attempts by email:", error);
      throw CustomError.internalServerError();
    }
  }

  async getRecentAttemptsByIp(
    ipAddress: string,
    minutes: number,
  ): Promise<LoginAttemptEntity[]> {
    try {
      const cutoffTime = new Date(Date.now() - minutes * 60 * 1000);

      const attempts = await this.loginAttemptRepository.find({
        where: {
          ipAddress,
          createdAt: LessThan(cutoffTime),
        },
        order: { createdAt: "DESC" },
      });

      return attempts.map(
        (attempt) =>
          new LoginAttemptEntity(
            attempt.id,
            attempt.email,
            attempt.userId,
            attempt.ipAddress,
            attempt.userAgent,
            attempt.success,
            attempt.createdAt,
          ),
      );
    } catch (error) {
      console.error("Error getting recent login attempts by IP:", error);
      throw CustomError.internalServerError();
    }
  }

  async countFailedAttempts(email: string, minutes: number): Promise<number> {
    try {
      const cutoffTime = new Date(Date.now() - minutes * 60 * 1000);

      const result = await this.loginAttemptRepository.count({
        where: {
          email,
          success: false,
          createdAt: LessThan(cutoffTime),
        },
      });

      return result;
    } catch (error) {
      console.error("Error counting failed login attempts:", error);
      throw CustomError.internalServerError();
    }
  }

  async countFailedAttemptsByIp(
    ipAddress: string,
    minutes: number,
  ): Promise<number> {
    try {
      const cutoffTime = new Date(Date.now() - minutes * 60 * 1000);

      const result = await this.loginAttemptRepository.count({
        where: {
          ipAddress,
          success: false,
          createdAt: LessThan(cutoffTime),
        },
      });

      return result;
    } catch (error) {
      console.error("Error counting failed login attempts by IP:", error);
      throw CustomError.internalServerError();
    }
  }

  async clearOldAttempts(hours: number): Promise<number> {
    try {
      const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);

      const result = await this.loginAttemptRepository.delete({
        createdAt: LessThan(cutoffTime),
      });

      return result.affected || 0;
    } catch (error) {
      console.error("Error clearing old login attempts:", error);
      throw CustomError.internalServerError();
    }
  }
}
