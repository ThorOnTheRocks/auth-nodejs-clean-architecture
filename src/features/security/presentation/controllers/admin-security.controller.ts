import { Request, Response } from "express";
import { CustomError } from "../../../../domain/errors/errors";
import { UserRepository } from "../../../auth/domain/repositories/user.repository";
import { UnlockAccount } from "../../domain/use-cases/unlock-account.use-case";
import { SecurityEventRepository } from "../../domain/repositories/security-event.repository";
import { GetSecurityEvents } from "../../domain/use-cases/get-security-events.use-case";
import { SecurityEventType } from "../../domain/entities/security-event.entity";
import { SecurityLoggerService } from "../../application/security-logger.service";

export class AdminSecurityController {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly securityEventRepository: SecurityEventRepository,
  ) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  };

  lockAccount = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      const { reason, days } = req.body;

      // Calculate lock expiry if days are provided
      let lockUntil: Date | null = null;
      if (days) {
        lockUntil = new Date();
        lockUntil.setDate(lockUntil.getDate() + parseInt(days));
      }

      const user = await this.userRepository.lockAccount(
        userId,
        lockUntil,
        reason || null,
      );

      // Log the action
      SecurityLoggerService.getInstance().logEvent(
        user.id,
        SecurityEventType.ACCOUNT_LOCKED,
        req.ip || null,
        req.headers["user-agent"] || null,
        {
          lockedBy: req.body.user.id,
          reason: reason || "Administrative action",
          lockedUntil: lockUntil,
        },
      );

      res.json({
        success: true,
        message: "Account has been locked",
        user: {
          id: user.id,
          email: user.email,
          isLocked: user.isLocked,
          lockedUntil: user.lockedUntil,
          lockReason: user.lockReason,
        },
      });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  unlockAccount = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;

      const unlocked = await new UnlockAccount(this.userRepository).execute(
        userId,
        req.body.user.id,
      );

      if (unlocked) {
        res.json({
          success: true,
          message: "Account has been unlocked",
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Failed to unlock account",
        });
      }
    } catch (error) {
      this.handleError(error, res);
    }
  };

  getUserSecurityEvents = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const { userId } = req.params;

      const events = await new GetSecurityEvents(
        this.securityEventRepository,
      ).getByUser(userId);

      res.json({ events });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  getFailedLoginAttempts = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const events = await new GetSecurityEvents(
        this.securityEventRepository,
      ).getByType(SecurityEventType.LOGIN_FAILURE, 100);

      res.json({ events });
    } catch (error) {
      this.handleError(error, res);
    }
  };
}
