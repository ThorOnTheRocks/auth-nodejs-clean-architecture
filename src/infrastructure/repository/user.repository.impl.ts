import { UserDataSource } from "../../domain/datasources/user.datasource";
import { UserEntity } from "../../domain/entities/user.entity";
import { UserRepository } from "../../domain/repository/user.repository";

export class UserRepositoryImpl implements UserRepository {
  constructor(
    private readonly userDataSource: UserDataSource
  ) {}

  findById(userId: string): Promise<UserEntity | null> {
    return this.userDataSource.findById(userId);
  }
}