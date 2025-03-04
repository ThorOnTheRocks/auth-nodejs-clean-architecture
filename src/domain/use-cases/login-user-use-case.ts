import { LoginUserDTO } from "../dtos/auth/login-user.dto";
import { CustomError } from "../errors/errors";
import { AuthRepository } from "../repository/auth.repository";
import { SignToken, UserToken } from "./types";

interface LoginUserUseCase {
  execute(loginUserDTO: LoginUserDTO): Promise<UserToken>
}

export class LoginUser implements LoginUserUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly signToken: SignToken 
  ) {}

  async execute(loginUserDTO: LoginUserDTO): Promise<UserToken> {
    const user = await this.authRepository.login(loginUserDTO);

    const token = await this.signToken({id: user.id}, '2h');
 
    if(!token) throw CustomError.internalServerError('Token not valid!')
  
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    }
  }

}