import { UserMapper } from './../mappers/user.mapper';
import { BcryptAdapter } from "../../config";
import { UserModel } from "../../data/mongodb";
import { AuthDataSource, CustomError, RegisterUserDTO, UserEntity } from "../../domain";
import { LoginUserDTO } from '../../domain/dtos/auth/login-user.dto';


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
        const userExists = await UserModel.findOne({email});
        if(userExists) throw CustomError.badRequest('User already exists');

        const user = await UserModel.create({
          name,
          email,
          password: this.hashPassword(password),
        })

        await user.save();

        return UserMapper.userEntityFromObject(user);

      } catch (error) {
        if(error instanceof CustomError) {
          throw error;
        }
        throw CustomError.internalServerError();
      }
  }

  async login(loginUserDTO: LoginUserDTO): Promise<UserEntity> {
      const { email, password } = loginUserDTO;

      try {
        const user = await UserModel.findOne({email});
        if(!user) throw CustomError.badRequest('User does not exists');
        
        const isMatching = await this.comparePassword(password, user.password)
        if(!isMatching) throw CustomError.badRequest('Wrong Password!');

        return UserMapper.userEntityFromObject(user)
      } catch (error) {
        if(error instanceof CustomError) {
          throw error;
        }
        throw CustomError.internalServerError();
      }
  }
}