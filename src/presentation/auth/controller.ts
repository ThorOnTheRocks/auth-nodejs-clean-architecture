import { Request, Response } from "express"
import { AuthRepository, CustomError, RegisterUserDTO } from "../../domain/index"

export class AuthController {
  constructor (
    private readonly authRepository: AuthRepository
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

    this.authRepository.register(registerUserDTO!)
    .then(user => res.json(user))
    .catch(error => this.handleError(error, res))
  };

  loginUser = (req: Request, res: Response) => {
    res.json("Controller user login")
  }
}