import { AuthDataSource, CustomError, RegisterUserDTO, UserEntity } from "../../domain";

export class AuthDataSourceImpl implements AuthDataSource {
  async register(registerUserDTO: RegisterUserDTO): Promise<UserEntity> {
      const { name, email, password } = registerUserDTO;

      try {
        // placeholder to remove when we connect to DB
        const user = await new UserEntity(
          '1',
          'Last',
          'last@google.com',
          '123456',
          ['ADMIN']
        )
        return user;
      } catch (error) {
        if(error instanceof CustomError) {
          throw error;
        }
        throw CustomError.internalServerError();
      }
  }
}