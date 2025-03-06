import { User } from "../../data/postgres/models/user.model";
import { CustomError, UserEntity } from "../../domain";

export class UserMapper {

  static toEntity(postgresUser: User): UserEntity {
    const { id, name, email, password, roles, img } = postgresUser;
    
    if(!id) throw CustomError.badRequest('Missing id');
    if(!name) throw CustomError.badRequest('Missing user name');
    if(!email) throw CustomError.badRequest('Missing email');
    if(!password) throw CustomError.badRequest('Missing password');
    if(!roles) throw CustomError.badRequest('Missing roles');
    
    return new UserEntity(
      id.toString(),
      name,
      email,
      password,
      roles,
      img
    );
  }
}