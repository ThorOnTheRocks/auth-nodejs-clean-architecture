// src/features/auth/domain/use-cases/change-password.use-case.ts
import { ChangePasswordDTO } from "../dtos/change-password.dto";
import { UserRepository } from "../repositories/user.repository";
import { CustomError } from "../../../../domain/errors/errors";
import { BcryptAdapter } from "../../../../config/bcrypt";

interface ChangePasswordUseCase {
  execute(changePasswordDTO: ChangePasswordDTO): Promise<boolean>;
}

export class ChangePassword implements ChangePasswordUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly comparePassword: (
      password: string,
      hashedPassword: string,
    ) => boolean = BcryptAdapter.compare,
    private readonly hashPassword: (
      password: string,
    ) => string = BcryptAdapter.hash,
  ) {}

  async execute(changePasswordDTO: ChangePasswordDTO): Promise<boolean> {
    try {
      // Get the user
      const user = await this.userRepository.findById(changePasswordDTO.userId);

      if (!user) {
        throw CustomError.notFound("User not found");
      }

      // Verify current password
      const isCurrentPasswordValid = this.comparePassword(
        changePasswordDTO.currentPassword,
        user.password,
      );

      if (!isCurrentPasswordValid) {
        throw CustomError.badRequest("Current password is incorrect");
      }

      // Hash and update the new password
      user.password = this.hashPassword(changePasswordDTO.newPassword);
      await this.userRepository.updateUser(user);

      return true;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServerError("Error changing password");
    }
  }
}
