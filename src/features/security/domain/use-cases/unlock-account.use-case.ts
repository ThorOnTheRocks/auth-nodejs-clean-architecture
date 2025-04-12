import { UserRepository } from "../../../auth/domain/repositories/user.repository";
import { CustomError } from "../../../../domain/errors/errors";
import { SecurityLoggerService } from "../../application/security-logger.service";
import { SecurityEventType } from "../entities/security-event.entity";

interface UnlockAccountUseCase {
  execute(userId: string, adminId: string | null): Promise<boolean>;
}

export class UnlockAccount implements UnlockAccountUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string, adminId: string | null): Promise<boolean> {
    try {
      const user = await this.userRepository.findById(userId);

      if (!user) {
        throw CustomError.notFound("User not found");
      }

      if (!user.isLocked) {
        return true; // Already unlocked
      }

      await this.userRepository.unlockAccount(userId);

      // Log the unlocking
      SecurityLoggerService.getInstance().logEvent(
        userId,
        SecurityEventType.ACCOUNT_UNLOCKED,
        null,
        null,
        {
          unlockedBy: adminId || "system",
        },
      );

      return true;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServerError("Error unlocking account");
    }
  }
}
