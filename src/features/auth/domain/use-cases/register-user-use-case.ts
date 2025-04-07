import { RegisterUserDTO } from "../dtos/register-user.dto";
import { CustomError } from "../../../../domain/errors/errors";
import { AuthRepository } from "../repositories/auth.repository";
import { SignToken, UserToken } from "../../../../types";

interface RegisterUserUseCase {
  execute(registerUser: RegisterUserDTO): Promise<UserToken>;
}

export class RegisterUser implements RegisterUserUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly signToken: SignToken,
  ) {}

  async execute(registerUserDTO: RegisterUserDTO): Promise<UserToken> {
    const user = await this.authRepository.register(registerUserDTO);

    const token = await this.signToken({ id: user.id }, "2h");
    if (!token) throw CustomError.internalServerError("Error generating token");

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
    };
  }
}
