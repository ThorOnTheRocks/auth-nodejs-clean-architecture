import { UserDataSource } from "../../domain/datasources/user.datasource";
import { UserEntity } from "../../domain/entities/user.entity";
import { PostgresDatabase } from "../../data/postgres/postgres.database";
import { User } from "../../data/postgres/models/user.model";
import { PostgresUserMapper } from "../mappers/postgres-user.mapper";
import { Repository } from "typeorm";
import { CustomError } from "../../domain/errors/errors";

export class PostgresUserDataSourceImpl implements UserDataSource {
  private readonly userRepository: Repository<User>;

  constructor() {
    this.userRepository = PostgresDatabase.appDataSource.getRepository(User);
  }

  async findById(userId: string): Promise<UserEntity | null> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });

      if (!user) return null;

      return PostgresUserMapper.toEntity(user);
    } catch (error) {
      console.error("Error finding user by ID:", error);
      throw CustomError.internalServerError();
    }
  }

  async updateUser(userEntity: UserEntity): Promise<UserEntity> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userEntity.id },
      });

      if (!user) {
        throw CustomError.notFound("User not found");
      }

      user.name = userEntity.name;
      user.email = userEntity.email;
      user.img = userEntity.img;

      const updatedUser = await this.userRepository.save(user);
      return PostgresUserMapper.toEntity(updatedUser);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      console.error("Error updating user:", error);
      throw CustomError.internalServerError();
    }
  }
}
