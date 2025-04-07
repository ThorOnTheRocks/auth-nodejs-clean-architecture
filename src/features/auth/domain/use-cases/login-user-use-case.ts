import { LoginUserDTO } from "../dtos/login-user.dto";
import { CustomError } from "../../../../domain/errors/errors";
import { AuthRepository } from "../repositories/auth.repository";
import { SignToken, UserToken } from "../../../../types";

interface LoginUserUseCase {
  execute(loginUserDTO: LoginUserDTO): Promise<UserToken>;
}

export class LoginUser implements LoginUserUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly signToken: SignToken,
  ) {}

  async execute(loginUserDTO: LoginUserDTO): Promise<UserToken> {
    const user = await this.authRepository.login(loginUserDTO);

    const token = await this.signToken({ id: user.id }, "2h");

    if (!token) throw CustomError.internalServerError("Token not valid!");

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isVerified: user.isVerified,
      },
    };
  }
}
