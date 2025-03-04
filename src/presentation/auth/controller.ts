import { Request, Response } from "express"
import { AuthRepository, CustomError, RegisterUser, RegisterUserDTO } from "../../domain/index"
import { JWTAdapter } from "../../config";
import { UserModel } from "../../data/mongodb";

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
    res.json("Controller user login")
  }

  getUsers = (req: Request, res: Response) => {
    UserModel.find()
    .then(users => res.json({
      users,
    }))
    .catch(() => res.status(500).json({error: 'Internal server error'}))
  }
}