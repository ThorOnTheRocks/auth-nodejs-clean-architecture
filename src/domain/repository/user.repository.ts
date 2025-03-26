import { UserEntity } from "../entities/user.entity";

export abstract class UserRepository {
  abstract findById(userId: string): Promise<UserEntity | null>;
  abstract updateUser(user: UserEntity): Promise<UserEntity>;
}
