import { LoginAttemptEntity } from "../entities/login-attempt.entity";

export abstract class LoginAttemptRepository {
  abstract recordAttempt(
    email: string,
    success: boolean,
    userId: string | null,
    ipAddress: string | null,
    userAgent: string | null,
  ): Promise<LoginAttemptEntity>;

  abstract getRecentAttemptsByEmail(
    email: string,
    minutes: number,
  ): Promise<LoginAttemptEntity[]>;

  abstract getRecentAttemptsByIp(
    ipAddress: string,
    minutes: number,
  ): Promise<LoginAttemptEntity[]>;

  abstract countFailedAttempts(email: string, minutes: number): Promise<number>;

  abstract countFailedAttemptsByIp(
    ipAddress: string,
    minutes: number,
  ): Promise<number>;

  abstract clearOldAttempts(hours: number): Promise<number>;
}
