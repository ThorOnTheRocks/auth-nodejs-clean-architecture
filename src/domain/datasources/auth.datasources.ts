import { UserEntity } from '../entities/user.entity';
import { RegisterUserDTO } from './../dtos/auth/register-user.dto';


export abstract class AuthDataSource {
  // abstract login(loginUserDTO: LoginUserDTO): Promise<UserEntity>

  abstract register(registerUserDTO: RegisterUserDTO): Promise<UserEntity>
}