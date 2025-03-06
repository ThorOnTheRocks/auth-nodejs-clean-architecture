import { LoginUserDTO } from './../../domain/dtos/auth/login-user.dto';
import { Request, Response } from "express"
import { AuthRepository, CustomError, RegisterUser, RegisterUserDTO } from "../../domain/index"
import { envs, JWTAdapter } from "../../config";
import { LoginUser } from '../../domain/use-cases/login-user-use-case';
import { PostgresDatabase } from "../../data/postgres/postgres.database";
import { User } from "../../data/postgres/models/user.model";
import { UserModel } from '../../data/mongodb';

export class AuthController {
  constructor (
    private readonly authRepository: AuthRepository,
  ) {}

  private handleError = (error: unknown, res: Response) => {
    if(error instanceof CustomError) {
      return res.status(error.statusCode).json({error: error.message})
    }
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }

  registerUser = (req: Request, res: Response) => {
    const [error, registerUserDTO] = RegisterUserDTO.create(req.body);
    if (error) res.status(400).json({ error });

    new RegisterUser(this.authRepository, JWTAdapter.generateToken)
    .execute(registerUserDTO!)
    .then(data => res.json(data))
    .catch(error => this.handleError(error, res))
  };

  loginUser = (req: Request, res: Response) => {
    const [error, loginUserDTO] = LoginUserDTO.create(req.body);
    if (error) res.status(400).json({ error });

    new LoginUser(this.authRepository, JWTAdapter.generateToken)
    .execute(loginUserDTO!)
    .then(data => res.json(data))
    .catch(error => this.handleError(error, res))
  }

  getUsers = (req: Request, res: Response) => {
    if (envs.DATABASE_TYPE === 'postgres') {
      const userRepository = PostgresDatabase.appDataSource.getRepository(User);
      
      userRepository.find()
      .then(users => res.json({
        users,
      }))
      
      .catch(() => res.status(500).json({error: 'Internal server error'}));
    } else {
      UserModel.find()
      .then(users => res.json({
        users,
      }))
      .catch(() => res.status(500).json({error: 'Internal server error'}));
    }
  }
}