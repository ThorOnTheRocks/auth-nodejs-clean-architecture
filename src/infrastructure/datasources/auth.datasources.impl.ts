import { BcryptAdapter } from "../../config";
import { UserModel } from "../../data/mongodb";
import { AuthDataSource, CustomError, RegisterUserDTO, UserEntity } from "../../domain";


type HashFunction = (password: string) => string;
type CompareFunction = (password: string, hashedPassword: string) => boolean;
export class AuthDataSourceImpl implements AuthDataSource {
  constructor(
    private readonly hashPassword: HashFunction = BcryptAdapter.hash,
    private readonly comparePassword: CompareFunction = BcryptAdapter.compare,
  ) {}
  async register(registerUserDTO: RegisterUserDTO): Promise<UserEntity> {
      const { name, email, password } = registerUserDTO;

      try {
        // placeholder to remove when we connect to DB
        const userExists = await UserModel.findOne({email});
        if(userExists) throw CustomError.badRequest('User already exists');

        const user = await UserModel.create({
          name,
          email,
          password: this.hashPassword(password),
        })

        return new UserEntity(
          user.id,
          user.name,
          user.email,
          user.password,
          user.roles
        )

      } catch (error) {
        if(error instanceof CustomError) {
          throw error;
        }
        throw CustomError.internalServerError();
      }
  }
}