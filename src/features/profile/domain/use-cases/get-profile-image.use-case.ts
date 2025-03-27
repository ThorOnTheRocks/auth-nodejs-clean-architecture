import { UserRepository } from "../../../auth/domain/repositories/user.repository";
import { CustomError } from "../../../../domain/errors/errors";

interface GetProfileImageUseCase {
  execute(userId: string): Promise<string>;
}

export class GetProfileImage implements GetProfileImageUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string): Promise<string> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw CustomError.notFound("User not found");
      }

      if (!user.img) {
        throw CustomError.notFound("User does not have a profile image");
      }

      return user.img;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServerError("Error retrieving profile image");
    }
  }
}
