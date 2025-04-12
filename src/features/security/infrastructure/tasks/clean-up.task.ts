import { LoginAttemptRepository } from "../../domain/repositories/login-attempt.repository";
import { SecurityEventRepository } from "../../domain/repositories/security-event.repository";

export class SecurityCleanupTask {
  constructor(
    private readonly loginAttemptRepository: LoginAttemptRepository,
    private readonly securityEventRepository: SecurityEventRepository,
  ) {}

  async runDailyCleanup(): Promise<void> {
    try {
      // Keep login attempts for 7 days
      const removedAttempts =
        await this.loginAttemptRepository.clearOldAttempts(24 * 7);

      // Keep security events for 90 days (if such a method exists)
      // This would need to be implemented in the SecurityEventRepository
      const removedEvents = await this.securityEventRepository.clearOldEvents(
        24 * 90,
      );

      console.log(
        `Cleaned up ${removedAttempts} old login attempts and ${removedEvents} old security events`,
      );
    } catch (error) {
      console.error("Error running security cleanup task:", error);
    }
  }
}
