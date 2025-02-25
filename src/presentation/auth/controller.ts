import { Request, Response } from "express"

export class AuthController {
  constructor () {}

  registerUser = (req: Request, res: Response ) => {
    res.json("Controller user register")
  }

  loginUser = (req: Request, res: Response) => {
    res.json("Controller user login")
  }
}