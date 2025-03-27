import { AuthDataSource } from "../../domain/datasources/auth.datasources";
import { AuthRepository } from "../../domain/repositories/auth.repository";
import { RegisterUserDTO } from "../../domain/dtos/register-user.dto";
import { UserEntity } from "../../domain/entities/user.entity";
import { LoginUserDTO } from "../../domain/dtos/login-user.dto";

export class AuthRepositoryImpl implements AuthRepository {
  constructor(private readonly authDataSource: AuthDataSource) {}

  register(registerUserDTO: RegisterUserDTO): Promise<UserEntity> {
    return this.authDataSource.register(registerUserDTO);
  }

  login(loginUserDTO: LoginUserDTO): Promise<UserEntity> {
    return this.authDataSource.login(loginUserDTO);
  }
}
