import { SecurityEventDataSource } from "../../domain/datasources/security-event.datasource";
import {
  SecurityEventEntity,
  SecurityEventType,
} from "../../domain/entities/security-event.entity";
import { SecurityEventRepository } from "../../domain/repositories/security-event.repository";

export class SecurityEventRepositoryImpl implements SecurityEventRepository {
  constructor(
    private readonly securityEventDataSource: SecurityEventDataSource,
  ) {}

  logEvent(
    userId: string | null,
    eventType: SecurityEventType,
    ipAddress: string | null,
    userAgent: string | null,
    details: Record<string, unknown> | null,
  ): Promise<SecurityEventEntity> {
    return this.securityEventDataSource.logEvent(
      userId,
      eventType,
      ipAddress,
      userAgent,
      details,
    );
  }

  getEventsByUser(userId: string): Promise<SecurityEventEntity[]> {
    return this.securityEventDataSource.getEventsByUser(userId);
  }

  getRecentEvents(limit: number): Promise<SecurityEventEntity[]> {
    return this.securityEventDataSource.getRecentEvents(limit);
  }

  getEventsByType(
    eventType: SecurityEventType,
    limit: number,
  ): Promise<SecurityEventEntity[]> {
    return this.securityEventDataSource.getEventsByType(eventType, limit);
  }

  clearOldEvents(hours: number): Promise<number> {
    return this.securityEventDataSource.clearOldEvents(hours);
  }
}
