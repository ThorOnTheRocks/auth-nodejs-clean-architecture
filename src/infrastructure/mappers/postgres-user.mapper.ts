import { User } from "../../data/postgres/models/user.model";
import { CustomError, UserEntity } from "../../domain";

export class PostgresUserMapper {

  static toEntity(postgresUser: User): UserEntity {
    const { name, email, password, roles, img } = postgresUser;
    
    if(!postgresUser.id) throw CustomError.badRequest('Missing id');
    if(!name) throw CustomError.badRequest('Missing user name');
    if(!email) throw CustomError.badRequest('Missing email');
    if(!password) throw CustomError.badRequest('Missing password');
    if(!roles) throw CustomError.badRequest('Missing roles');
    
    return new UserEntity(
      postgresUser.id,
      name,
      email,
      password,
      roles,
      img
    );
  }
}