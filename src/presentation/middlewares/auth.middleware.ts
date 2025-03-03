import { Request, Response, NextFunction } from "express";
import { JWTAdapter } from "../../config";
import { UserModel } from "../../data/mongodb";


export class AuthMiddleware {
  
  static validateJWT = async (req: Request, res: Response, next: NextFunction): Promise<void>  => {

    const authorization = req.header('Authorization');
    if(!authorization) {
      res.status(401).json({error: 'No token provided'})
      return;
    };
    if(!authorization.startsWith('Bearer ')) {
      res.status(401).json({error: 'Invalid token!'})
      return;
    };

    const token = authorization.split(' ').at(1) || '';

    try {

      const payload = await JWTAdapter.validateToken<{id: string}>(token);
      if(!payload) {
        res.status(401).json({error: 'Invalid token'});
        return;
      };

      const user = await UserModel.findById(payload.id);
      if(!user) {
        res.status(401).json({error: 'User does not exists'});
        return;
      };

      req.body.user = user;

      next();
    } catch (error) {
      console.log(error);
      res.status(500).json({error: 'Internal server error'});
      next(error)
    }
  }
}