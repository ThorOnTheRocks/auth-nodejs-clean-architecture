import { Request, Response } from "express"
import { AuthRepository, RegisterUserDTO } from "../../domain/index"

export class AuthController {
  constructor (
    private readonly authRepository: AuthRepository
  ) {}

  registerUser = (req: Request, res: Response) => {
    const [error, registerUserDTO] = RegisterUserDTO.create(req.body);
    if (error) res.status(400).json({ error });

    this.authRepository.register(registerUserDTO!)
    .then(user => res.json(user))
    .catch(error => res.status(500))
  };

  loginUser = (req: Request, res: Response) => {
    res.json("Controller user login")
  }
}