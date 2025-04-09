import { SecurityEventType } from "../domain/entities/security-event.entity";
import { LogSecurityEvent } from "../domain/use-cases/log-security-event.use-case";
import { SecurityEventRepository } from "../domain/repositories/security-event.repository";

export class SecurityLoggerService {
  private static instance: SecurityLoggerService;
  private securityEventRepository: SecurityEventRepository | null = null;

  private constructor() {}

  public static getInstance(): SecurityLoggerService {
    if (!SecurityLoggerService.instance) {
      SecurityLoggerService.instance = new SecurityLoggerService();
    }
    return SecurityLoggerService.instance;
  }

  public initialize(securityEventRepository: SecurityEventRepository): void {
    this.securityEventRepository = securityEventRepository;
  }

  public async logEvent(
    userId: string | null,
    eventType: SecurityEventType,
    ipAddress: string | null,
    userAgent: string | null,
    details: Record<string, unknown> | null = null,
  ): Promise<void> {
    if (!this.securityEventRepository) {
      console.error("SecurityLoggerService not initialized with repository");
      return;
    }

    try {
      await new LogSecurityEvent(this.securityEventRepository).execute(
        userId,
        eventType,
        ipAddress,
        userAgent,
        details,
      );
    } catch (error) {
      console.error("Failed to log security event:", error);
    }
  }
}
