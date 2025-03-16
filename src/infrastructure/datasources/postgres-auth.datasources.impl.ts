import { PostgresUserMapper } from "../mappers/postgres-user.mapper";
import { BcryptAdapter } from "../../config";
import {
  AuthDataSource,
  CustomError,
  RegisterUserDTO,
  UserEntity,
} from "../../domain";
import { LoginUserDTO } from "../../domain/dtos/auth/login-user.dto";
import { PostgresDatabase } from "../../data/postgres/postgres.database";
import { Repository } from "typeorm";
import { User } from "../../data/postgres/models/user.model";

type HashFunction = (password: string) => string;
type CompareFunction = (password: string, hashedPassword: string) => boolean;

export class PostgresAuthDataSourceImpl implements AuthDataSource {
  private readonly userRepository: Repository<User>;
  constructor(
    private readonly hashPassword: HashFunction = BcryptAdapter.hash,
    private readonly comparePassword: CompareFunction = BcryptAdapter.compare,
  ) {
    this.userRepository = PostgresDatabase.appDataSource.getRepository(User);
  }

  async register(registerUserDTO: RegisterUserDTO): Promise<UserEntity> {
    const { name, email, password } = registerUserDTO;

    try {
      const userExists = await this.userRepository.findOne({
        where: { email },
      });
      if (userExists) throw CustomError.badRequest("User already exists");

      const user = await this.userRepository.create({
        name,
        email,
        password: this.hashPassword(password),
        roles: ["USER_ROLE"],
      });

      const savedUser = await this.userRepository.save(user);

      return PostgresUserMapper.toEntity(savedUser);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServerError();
    }
  }

  async login(loginUserDTO: LoginUserDTO): Promise<UserEntity> {
    const { email, password } = loginUserDTO;

    try {
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) throw CustomError.badRequest("User does not exists");

      const isMatching = await this.comparePassword(password, user.password);
      if (!isMatching) throw CustomError.badRequest("Wrong Password!");

      return PostgresUserMapper.toEntity(user);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServerError();
    }
  }
}
