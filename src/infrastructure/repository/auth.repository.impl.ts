import { AuthDataSource, AuthRepository, RegisterUserDTO, UserEntity } from "../../domain";

export class AuthRepositoryImpl implements AuthRepository {
  constructor(
    private readonly authDataSource: AuthDataSource
  ) {}

  register(registerUserDTO: RegisterUserDTO): Promise<UserEntity> {
      return this.authDataSource.register(registerUserDTO)
  }
}