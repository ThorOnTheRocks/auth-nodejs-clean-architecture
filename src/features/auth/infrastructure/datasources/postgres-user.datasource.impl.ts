import { UserDataSource } from "../../domain/datasources/user.datasource";
import { UserEntity } from "../../domain/entities/user.entity";
import { PostgresDatabase } from "../../../../database/postgres/postgres.database";
import { User } from "../../../../database/postgres/models/user.model";
import { PostgresUserMapper } from "../mappers/postgres-user.mapper";
import { Repository } from "typeorm";
import { CustomError } from "../../../../domain/errors/errors";

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

  async findByEmail(email: string): Promise<UserEntity[]> {
    try {
      const users = await this.userRepository.find({
        where: { email },
      });

      return users.map((user) => PostgresUserMapper.toEntity(user));
    } catch (error) {
      console.error("Error finding users by email:", error);
      throw CustomError.internalServerError();
    }
  }

  async lockAccount(
    userId: string,
    until: Date | null,
    reason: string | null,
  ): Promise<UserEntity> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        throw CustomError.notFound("User not found");
      }

      user.isLocked = true;
      user.lockedUntil = until;
      user.lockReason = reason;

      const updatedUser = await this.userRepository.save(user);
      return PostgresUserMapper.toEntity(updatedUser);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      console.error("Error locking user account:", error);
      throw CustomError.internalServerError();
    }
  }

  async unlockAccount(userId: string): Promise<UserEntity> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        throw CustomError.notFound("User not found");
      }

      user.isLocked = false;
      user.lockedUntil = null;
      user.lockReason = null;

      const updatedUser = await this.userRepository.save(user);
      return PostgresUserMapper.toEntity(updatedUser);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      console.error("Error unlocking user account:", error);
      throw CustomError.internalServerError();
    }
  }
}
