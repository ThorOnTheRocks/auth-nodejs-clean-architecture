import { LoginAttemptRepository } from "../../domain/repositories/login-attempt.repository";

export class SecurityCleanupTask {
  constructor(
    private readonly loginAttemptRepository: LoginAttemptRepository,
  ) {}

  async cleanupOldLoginAttempts(): Promise<number> {
    // Keep login attempts for 7 days
    return await this.loginAttemptRepository.clearOldAttempts(24 * 7);
  }
}
