import { Request, Response } from "express"
import { RegisterUserDTO } from "../../domain/index"

export class AuthController {
  constructor () {}

  registerUser = (req: Request, res: Response) => {
    const [error, registerUserDTO] = RegisterUserDTO.create(req.body);
    if (error) res.status(400).json({ error });

    res.json(registerUserDTO);
  };

  loginUser = (req: Request, res: Response) => {
    res.json("Controller user login")
  }
}