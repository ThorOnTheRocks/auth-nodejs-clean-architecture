import { Repository } from "typeorm";
import { User } from "../../data/postgres/models/user.model";
import { AuthMethod } from "../../data/postgres/models/authMethod.model";
import { PostgresDatabase } from "../../data/postgres/postgres.database";
import { OAuthDatasource } from "../../domain/datasources/oauth.datasource";
import {
  AuthMethodEntity,
  OauthProvider,
} from "../../domain/entities/authMethod.entity";
import { UserEntity } from "../../domain/entities/user.entity";
import { CustomError } from "../../domain/errors/errors";
import { PostgresUserMapper } from "../mappers/postgres-user.mapper";
import { BcryptAdapter } from "../../config";
import { v4 as uuidv4 } from "uuid";
import { OauthProfileDTO } from "../../domain/dtos/auth/oauth-profile.dto";

export class PostgresOAuthDatasourceImpl implements OAuthDatasource {
  private readonly authMethodRepository: Repository<AuthMethod>;
  private readonly userRepository: Repository<User>;

  constructor() {
    this.authMethodRepository =
      PostgresDatabase.appDataSource.getRepository(AuthMethod);
    this.userRepository = PostgresDatabase.appDataSource.getRepository(User);
  }

  async findOrCreateByOAuth(
    provider: string,
    profile: OauthProfileDTO,
  ): Promise<UserEntity> {
    try {
      const existingAuthMethod = await this.authMethodRepository.findOne({
        where: {
          provider: provider as OauthProvider,
          metadata: { id: profile.providerId },
        },
      });

      if (existingAuthMethod) {
        const user = await this.userRepository.findOne({
          where: { id: existingAuthMethod.userId },
        });
        if (!user) throw CustomError.notFound("User not found");
        return PostgresUserMapper.toEntity(user);
      }

      let user: User | null = null;
      if (profile.email) {
        user = await this.userRepository.findOne({
          where: { email: profile.email },
        });
      }

      if (!user) {
        const randomPassword = uuidv4();
        const hashedPassword = BcryptAdapter.hash(randomPassword);

        user = this.userRepository.create({
          name: profile.name,
          email:
            profile.email || `${provider}_${profile.providerId}@example.com`,
          password: hashedPassword,
          img: profile.picture,
          roles: ["USER_ROLE"],
        });

        user = await this.userRepository.save(user);
      }

      await this.authMethodRepository.save({
        userId: user.id,
        provider: provider as OauthProvider,
        email: profile.email,
        metadata: {
          id: profile.providerId,
          metadata: profile.metadata,
        },
      });

      return PostgresUserMapper.toEntity(user);
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw CustomError.internalServerError(`OAuth error: ${String(error)}`);
    }
  }

  async linkOAuthToUser(
    userId: string,
    provider: string,
    profile: {
      id: string;
      email?: string;
      metadata?: Record<string, unknown>;
    },
  ): Promise<AuthMethodEntity> {
    try {
      const userExists = await this.userRepository.findOne({
        where: { id: userId },
      });
      if (!userExists) throw CustomError.notFound("User not found");

      const existingAuthMethod = await this.authMethodRepository.findOne({
        where: {
          userId,
          provider: provider as OauthProvider,
        },
      });

      if (existingAuthMethod) {
        throw CustomError.badRequest(
          "This provider is already linked to your account",
        );
      }

      const authMethod = this.authMethodRepository.create({
        userId,
        provider: provider as OauthProvider,
        email: profile.email,
        metadata: {
          id: profile.id,
          ...(profile.metadata || {}),
        },
      });

      const savedAuthMethod = await this.authMethodRepository.save(authMethod);

      return new AuthMethodEntity(
        savedAuthMethod.id,
        savedAuthMethod.userId,
        savedAuthMethod.provider,
        savedAuthMethod.email,
        savedAuthMethod.metadata,
      );
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw CustomError.internalServerError("Error linking OAuth account");
    }
  }

  async unlinkOAuthFromUser(
    userId: string,
    provider: string,
  ): Promise<boolean> {
    try {
      const authMethods = await this.authMethodRepository.find({
        where: { userId },
      });

      if (authMethods.length <= 1) {
        throw CustomError.badRequest(
          "Cannot unlink the only authentication method",
        );
      }

      const result = await this.authMethodRepository.delete({
        userId,
        provider: provider as OauthProvider,
      });

      return result.affected ? result.affected > 0 : false;
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw CustomError.internalServerError("Error unlinking OAuth account");
    }
  }

  async findAuthMethodsByUserId(userId: string): Promise<AuthMethodEntity[]> {
    try {
      const authMethods = await this.authMethodRepository.find({
        where: { userId },
      });

      return authMethods.map(
        (method) =>
          new AuthMethodEntity(
            method.id,
            method.userId,
            method.provider,
            method.email,
            method.metadata,
          ),
      );
    } catch (error) {
      console.error("Error finding auth methods:", error);
      throw CustomError.internalServerError();
    }
  }
}
