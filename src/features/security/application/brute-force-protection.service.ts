import { CheckBruteForce } from "../domain/use-cases/check-brute-force.use-case";
import { LoginAttemptRepository } from "../domain/repositories/login-attempt.repository";
import { UserRepository } from "../../auth/domain/repositories/user.repository";

export class BruteForceProtectionService {
  private static instance: BruteForceProtectionService;
  private checkBruteForce: CheckBruteForce | null = null;

  private constructor() {}

  public static getInstance(): BruteForceProtectionService {
    if (!BruteForceProtectionService.instance) {
      BruteForceProtectionService.instance = new BruteForceProtectionService();
    }
    return BruteForceProtectionService.instance;
  }

  public initialize(
    loginAttemptRepository: LoginAttemptRepository,
    userRepository: UserRepository,
  ): void {
    this.checkBruteForce = new CheckBruteForce(
      loginAttemptRepository,
      userRepository,
    );
  }

  public async check(email: string, ipAddress: string | null): Promise<void> {
    if (!this.checkBruteForce) {
      console.error("BruteForceProtectionService not initialized");
      return;
    }

    await this.checkBruteForce.execute(email, ipAddress);
  }

  public async recordSuccess(
    email: string,
    userId: string,
    ipAddress: string | null,
    userAgent: string | null,
  ): Promise<void> {
    if (!this.checkBruteForce) {
      console.error("BruteForceProtectionService not initialized");
      return;
    }

    await this.checkBruteForce.recordLoginSuccess(
      email,
      userId,
      ipAddress,
      userAgent,
    );
  }

  public async recordFailure(
    email: string,
    ipAddress: string | null,
    userAgent: string | null,
  ): Promise<void> {
    if (!this.checkBruteForce) {
      console.error("BruteForceProtectionService not initialized");
      return;
    }

    await this.checkBruteForce.recordLoginFailure(email, ipAddress, userAgent);
  }

  public async cleanupOldAttempts(): Promise<void> {
    // Cleanup function to be called by a cron job
    // Implementation omitted for brevity
  }
}
