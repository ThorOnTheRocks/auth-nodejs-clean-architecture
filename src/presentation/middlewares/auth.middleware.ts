import { Request, Response, NextFunction } from "express";
import { JWTAdapter } from "../../config";
import { PostgresDatabase } from "../../data/postgres/postgres.database";
import { User } from "../../data/postgres/models/user.model";

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

      const userRepository = PostgresDatabase.appDataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { id: payload.id } });
      
      if(!user) {
        res.status(401).json({error: 'User does not exist'});
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