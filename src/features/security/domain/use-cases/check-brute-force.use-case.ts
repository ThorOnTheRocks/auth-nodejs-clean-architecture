import { LoginAttemptRepository } from "../repositories/login-attempt.repository";
import { CustomError } from "../../../../domain/errors/errors";
import { UserRepository } from "../../../auth/domain/repositories/user.repository";
import { SecurityLoggerService } from "../../application/security-logger.service";
import { SecurityEventType } from "../entities/security-event.entity";

// Constants
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;
const ATTEMPT_WINDOW_MINUTES = 60;

interface CheckBruteForceUseCase {
  execute(email: string, ipAddress: string | null): Promise<void>;
  recordLoginSuccess(
    email: string,
    userId: string,
    ipAddress: string | null,
    userAgent: string | null,
  ): Promise<void>;
  recordLoginFailure(
    email: string,
    ipAddress: string | null,
    userAgent: string | null,
  ): Promise<void>;
}

export class CheckBruteForce implements CheckBruteForceUseCase {
  constructor(
    private readonly loginAttemptRepository: LoginAttemptRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(email: string, ipAddress: string | null): Promise<void> {
    try {
      // 1. Check if account is already locked
      const users = await this.userRepository.findByEmail(email);

      if (users.length > 0) {
        const user = users[0];

        if (user.isLocked) {
          // Check if lock has expired
          if (user.lockedUntil && user.lockedUntil > new Date()) {
            throw CustomError.forbidden(
              "Account is temporarily locked. Please try again later or reset your password.",
            );
          } else if (user.lockedUntil) {
            // Lock has expired, unlock the account
            await this.userRepository.unlockAccount(user.id);
          } else if (!user.lockedUntil) {
            // Account is permanently locked by admin
            throw CustomError.forbidden(
              "Account has been locked. Please contact support.",
            );
          }
        }
      }

      // 2. Check failed attempts by email
      const failedAttempts =
        await this.loginAttemptRepository.countFailedAttempts(
          email,
          ATTEMPT_WINDOW_MINUTES,
        );

      if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
        // If the user exists, lock their account
        if (users.length > 0) {
          const user = users[0];
          const lockUntil = new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000);

          await this.userRepository.lockAccount(
            user.id,
            lockUntil,
            "Too many failed login attempts",
          );

          // Log the account lock
          SecurityLoggerService.getInstance().logEvent(
            user.id,
            SecurityEventType.ACCOUNT_LOCKED,
            ipAddress,
            null,
            {
              reason: "Too many failed login attempts",
              lockedUntil: lockUntil,
              failedAttempts,
            },
          );
        }

        throw CustomError.forbidden(
          `Too many failed login attempts. Account is temporarily locked for ${LOCKOUT_MINUTES} minutes.`,
        );
      }

      // 3. Check failed attempts by IP (if IP is provided)
      if (ipAddress) {
        const failedIpAttempts =
          await this.loginAttemptRepository.countFailedAttemptsByIp(
            ipAddress,
            ATTEMPT_WINDOW_MINUTES,
          );

        const IP_MAX_ATTEMPTS = MAX_FAILED_ATTEMPTS * 2; // Higher threshold for IP-based rate limiting

        if (failedIpAttempts >= IP_MAX_ATTEMPTS) {
          // We don't lock accounts here, just block the request
          throw CustomError.tooManyRequests(
            "Too many login attempts from this IP. Please try again later.",
          );
        }
      }
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServerError(
        "Error checking brute force protection",
      );
    }
  }

  async recordLoginSuccess(
    email: string,
    userId: string,
    ipAddress: string | null,
    userAgent: string | null,
  ): Promise<void> {
    try {
      await this.loginAttemptRepository.recordAttempt(
        email,
        true,
        userId,
        ipAddress,
        userAgent,
      );
    } catch (error) {
      console.error("Error recording successful login attempt:", error);
      // Don't throw here, just log the error - we don't want to interrupt the login flow
    }
  }

  async recordLoginFailure(
    email: string,
    ipAddress: string | null,
    userAgent: string | null,
  ): Promise<void> {
    try {
      await this.loginAttemptRepository.recordAttempt(
        email,
        false,
        null, // userId is null for failed attempts
        ipAddress,
        userAgent,
      );
    } catch (error) {
      console.error("Error recording failed login attempt:", error);
      // Don't throw here, just log the error
    }
  }
}
