import { UserEntity } from "../entities/user.entity";

export abstract class UserRepository {
  abstract findById(userId: string): Promise<UserEntity | null>;
  abstract findByEmail(email: string): Promise<UserEntity[]>;
  abstract updateUser(user: UserEntity): Promise<UserEntity>;
  abstract lockAccount(
    userId: string,
    until: Date | null,
    reason: string | null,
  ): Promise<UserEntity>;
  abstract unlockAccount(userId: string): Promise<UserEntity>;
}
