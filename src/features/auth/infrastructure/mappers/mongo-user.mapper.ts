import { Document } from "mongoose";
import { CustomError, UserEntity } from "../../../../domain";

interface MongoUser extends Document {
  name: string;
  email: string;
  password: string;
  roles: string[];
  img?: string | null;
  isVerified?: boolean;
  isLocked?: boolean;
  lockedUntil?: Date | null;
  lockReason?: string | null;
}

export class MongoUserMapper {
  static toEntity(mongoUser: MongoUser): UserEntity {
    const id = mongoUser.id || mongoUser._id;
    const {
      name,
      email,
      password,
      roles,
      img,
      isVerified,
      isLocked,
      lockedUntil,
      lockReason,
    } = mongoUser;

    if (!id) throw CustomError.badRequest("Missing id");
    if (!name) throw CustomError.badRequest("Missing user name");
    if (!email) throw CustomError.badRequest("Missing email");
    if (!password) throw CustomError.badRequest("Missing password");
    if (!roles) throw CustomError.badRequest("Missing roles");

    return new UserEntity(
      id,
      name,
      email,
      password,
      roles,
      isVerified || false,
      img || undefined,
      isLocked || false,
      lockedUntil || null,
      lockReason || null,
    );
  }
}
