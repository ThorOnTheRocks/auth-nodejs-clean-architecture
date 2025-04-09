import { Repository } from "typeorm";
import { SecurityEvent } from "../../../../database/postgres/models/security-event.model";
import { PostgresDatabase } from "../../../../database/postgres/postgres.database";
import { SecurityEventDataSource } from "../../domain/datasources/security-event.datasource";
import {
  SecurityEventEntity,
  SecurityEventType,
} from "../../domain/entities/security-event.entity";
import { CustomError } from "../../../../domain/errors/errors";

export class PostgresSecurityEventDataSourceImpl
  implements SecurityEventDataSource
{
  private readonly securityEventRepository: Repository<SecurityEvent>;

  constructor() {
    this.securityEventRepository =
      PostgresDatabase.appDataSource.getRepository(SecurityEvent);
  }

  async logEvent(
    userId: string | null,
    eventType: SecurityEventType,
    ipAddress: string | null,
    userAgent: string | null,
    details: Record<string, unknown> | null,
  ): Promise<SecurityEventEntity> {
    try {
      const securityEvent = this.securityEventRepository.create({
        userId,
        eventType,
        ipAddress,
        userAgent,
        details,
      });

      const savedEvent = await this.securityEventRepository.save(securityEvent);

      return new SecurityEventEntity(
        savedEvent.id,
        savedEvent.userId,
        savedEvent.eventType as SecurityEventType,
        savedEvent.ipAddress,
        savedEvent.userAgent,
        savedEvent.details,
        savedEvent.createdAt,
      );
    } catch (error) {
      console.error("Error logging security event:", error);
      throw CustomError.internalServerError("Failed to log security event");
    }
  }

  async getEventsByUser(userId: string): Promise<SecurityEventEntity[]> {
    try {
      const events = await this.securityEventRepository.find({
        where: { userId },
        order: { createdAt: "DESC" },
      });

      return events.map(
        (event) =>
          new SecurityEventEntity(
            event.id,
            event.userId,
            event.eventType as SecurityEventType,
            event.ipAddress,
            event.userAgent,
            event.details,
            event.createdAt,
          ),
      );
    } catch (error) {
      console.error("Error getting security events by user:", error);
      throw CustomError.internalServerError();
    }
  }

  async getRecentEvents(limit: number = 100): Promise<SecurityEventEntity[]> {
    try {
      const events = await this.securityEventRepository.find({
        order: { createdAt: "DESC" },
        take: limit,
      });

      return events.map(
        (event) =>
          new SecurityEventEntity(
            event.id,
            event.userId,
            event.eventType as SecurityEventType,
            event.ipAddress,
            event.userAgent,
            event.details,
            event.createdAt,
          ),
      );
    } catch (error) {
      console.error("Error getting recent security events:", error);
      throw CustomError.internalServerError();
    }
  }

  async getEventsByType(
    eventType: SecurityEventType,
    limit: number = 100,
  ): Promise<SecurityEventEntity[]> {
    try {
      const events = await this.securityEventRepository.find({
        where: { eventType },
        order: { createdAt: "DESC" },
        take: limit,
      });

      return events.map(
        (event) =>
          new SecurityEventEntity(
            event.id,
            event.userId,
            event.eventType as SecurityEventType,
            event.ipAddress,
            event.userAgent,
            event.details,
            event.createdAt,
          ),
      );
    } catch (error) {
      console.error("Error getting security events by type:", error);
      throw CustomError.internalServerError();
    }
  }
}
