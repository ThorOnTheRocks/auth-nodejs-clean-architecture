import { LoginUserDTO } from '../dtos/auth/login-user.dto';
import { UserEntity } from '../entities/user.entity';
import { RegisterUserDTO } from './../dtos/auth/register-user.dto';


export abstract class AuthRepository {
  abstract login(loginUserDTO: LoginUserDTO): Promise<UserEntity>

  abstract register(registerUserDTO: RegisterUserDTO): Promise<UserEntity>
}