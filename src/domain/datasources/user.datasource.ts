import { UserEntity } from "../entities/user.entity";

export abstract class UserDataSource {
  abstract findById(userId: string): Promise<UserEntity | null>;
}
