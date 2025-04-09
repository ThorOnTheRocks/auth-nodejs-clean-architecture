import {
  SecurityEventEntity,
  SecurityEventType,
} from "../entities/security-event.entity";
import { SecurityEventRepository } from "../repositories/security-event.repository";
import { CustomError } from "../../../../domain/errors/errors";

interface GetSecurityEventsUseCase {
  getByUser(userId: string): Promise<SecurityEventEntity[]>;
  getRecent(limit: number): Promise<SecurityEventEntity[]>;
  getByType(
    eventType: SecurityEventType,
    limit: number,
  ): Promise<SecurityEventEntity[]>;
}

export class GetSecurityEvents implements GetSecurityEventsUseCase {
  constructor(
    private readonly securityEventRepository: SecurityEventRepository,
  ) {}

  async getByUser(userId: string): Promise<SecurityEventEntity[]> {
    try {
      return await this.securityEventRepository.getEventsByUser(userId);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServerError("Error retrieving security events");
    }
  }

  async getRecent(limit: number = 100): Promise<SecurityEventEntity[]> {
    try {
      return await this.securityEventRepository.getRecentEvents(limit);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServerError(
        "Error retrieving recent security events",
      );
    }
  }

  async getByType(
    eventType: SecurityEventType,
    limit: number = 100,
  ): Promise<SecurityEventEntity[]> {
    try {
      return await this.securityEventRepository.getEventsByType(
        eventType,
        limit,
      );
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServerError(
        "Error retrieving security events by type",
      );
    }
  }
}
