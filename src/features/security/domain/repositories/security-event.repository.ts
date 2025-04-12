import {
  SecurityEventEntity,
  SecurityEventType,
} from "../entities/security-event.entity";

export abstract class SecurityEventRepository {
  abstract logEvent(
    userId: string | null,
    eventType: SecurityEventType,
    ipAddress: string | null,
    userAgent: string | null,
    details: Record<string, unknown> | null,
  ): Promise<SecurityEventEntity>;

  abstract getEventsByUser(userId: string): Promise<SecurityEventEntity[]>;

  abstract getRecentEvents(limit: number): Promise<SecurityEventEntity[]>;

  abstract getEventsByType(
    eventType: SecurityEventType,
    limit: number,
  ): Promise<SecurityEventEntity[]>;

  abstract clearOldEvents(hours: number): Promise<number>;
}
