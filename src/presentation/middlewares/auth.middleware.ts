import { Request, Response, NextFunction } from "express";


export class AuthMiddleware {
  
  static validateJWT = async (req: Request, res: Response, next: NextFunction) => {

    console.log('Validating JWT')
    next();
  }
}