// src/features/security/presentation/controllers/security.controller.ts
import { Request, Response } from "express";
import { CustomError } from "../../../../domain/errors/errors";
import { SecurityEventRepository } from "../../domain/repositories/security-event.repository";
import { GetSecurityEvents } from "../../domain/use-cases/get-security-events.use-case";
import { SecurityEventType } from "../../domain/entities/security-event.entity";

export class SecurityController {
  constructor(
    private readonly securityEventRepository: SecurityEventRepository,
  ) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  };

  getUserEvents = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.userId;
      const events = await new GetSecurityEvents(
        this.securityEventRepository,
      ).getByUser(userId);

      res.json({ events });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  getRecentEvents = async (req: Request, res: Response): Promise<void> => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      const events = await new GetSecurityEvents(
        this.securityEventRepository,
      ).getRecent(limit);

      res.json({ events });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  getEventsByType = async (req: Request, res: Response): Promise<void> => {
    try {
      const { type } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;

      if (
        !Object.values(SecurityEventType).includes(type as SecurityEventType)
      ) {
        res.status(400).json({ error: "Invalid event type" });
        return;
      }

      const events = await new GetSecurityEvents(
        this.securityEventRepository,
      ).getByType(type as SecurityEventType, limit);

      res.json({ events });
    } catch (error) {
      this.handleError(error, res);
    }
  };
}
