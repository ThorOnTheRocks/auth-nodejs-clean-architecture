import { LoginAttemptDataSource } from "../../domain/datasources/login-attempt.datasource";
import { LoginAttemptEntity } from "../../domain/entities/login-attempt.entity";
import { LoginAttemptRepository } from "../../domain/repositories/login-attempt.repository";

export class LoginAttemptRepositoryImpl implements LoginAttemptRepository {
  constructor(
    private readonly loginAttemptDataSource: LoginAttemptDataSource,
  ) {}

  recordAttempt(
    email: string,
    success: boolean,
    userId: string | null,
    ipAddress: string | null,
    userAgent: string | null,
  ): Promise<LoginAttemptEntity> {
    return this.loginAttemptDataSource.recordAttempt(
      email,
      success,
      userId,
      ipAddress,
      userAgent,
    );
  }

  getRecentAttemptsByEmail(
    email: string,
    minutes: number,
  ): Promise<LoginAttemptEntity[]> {
    return this.loginAttemptDataSource.getRecentAttemptsByEmail(email, minutes);
  }

  getRecentAttemptsByIp(
    ipAddress: string,
    minutes: number,
  ): Promise<LoginAttemptEntity[]> {
    return this.loginAttemptDataSource.getRecentAttemptsByIp(
      ipAddress,
      minutes,
    );
  }

  countFailedAttempts(email: string, minutes: number): Promise<number> {
    return this.loginAttemptDataSource.countFailedAttempts(email, minutes);
  }

  countFailedAttemptsByIp(ipAddress: string, minutes: number): Promise<number> {
    return this.loginAttemptDataSource.countFailedAttemptsByIp(
      ipAddress,
      minutes,
    );
  }

  clearOldAttempts(hours: number): Promise<number> {
    return this.loginAttemptDataSource.clearOldAttempts(hours);
  }
}
