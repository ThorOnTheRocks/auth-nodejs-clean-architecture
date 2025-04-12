import { UserDataSource } from "../../domain/datasources/user.datasource";
import { UserEntity } from "../../domain/entities/user.entity";
import { UserRepository } from "../../domain/repositories/user.repository";

export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly userDataSource: UserDataSource) {}

  findById(userId: string): Promise<UserEntity | null> {
    return this.userDataSource.findById(userId);
  }

  updateUser(user: UserEntity): Promise<UserEntity> {
    return this.userDataSource.updateUser(user);
  }

  findByEmail(email: string): Promise<UserEntity[]> {
    return this.userDataSource.findByEmail(email);
  }

  lockAccount(
    userId: string,
    until: Date | null,
    reason: string | null,
  ): Promise<UserEntity> {
    return this.userDataSource.lockAccount(userId, until, reason);
  }

  unlockAccount(userId: string): Promise<UserEntity> {
    return this.userDataSource.unlockAccount(userId);
  }
}
