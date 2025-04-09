import {
  SecurityEventEntity,
  SecurityEventType,
} from "../entities/security-event.entity";
import { SecurityEventRepository } from "../repositories/security-event.repository";
import { CustomError } from "../../../../domain/errors/errors";

interface LogSecurityEventUseCase {
  execute(
    userId: string | null,
    eventType: SecurityEventType,
    ipAddress: string | null,
    userAgent: string | null,
    details: Record<string, unknown> | null,
  ): Promise<SecurityEventEntity>;
}

export class LogSecurityEvent implements LogSecurityEventUseCase {
  constructor(
    private readonly securityEventRepository: SecurityEventRepository,
  ) {}

  async execute(
    userId: string | null,
    eventType: SecurityEventType,
    ipAddress: string | null,
    userAgent: string | null,
    details: Record<string, unknown> | null,
  ): Promise<SecurityEventEntity> {
    try {
      return await this.securityEventRepository.logEvent(
        userId,
        eventType,
        ipAddress,
        userAgent,
        details,
      );
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServerError("Error logging security event");
    }
  }
}
