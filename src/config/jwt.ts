import jwt from 'jsonwebtoken'
import { envs } from './envs';

const JWT_SEED = envs.JWT_SECRET;

type JWTExpiration =
  | `${number}s`
  | `${number}m`
  | `${number}h`
  | `${number}d`
  | `${number}w`
  | number;

export class JWTAdapter {

  static generateToken(payload: Object, duration: JWTExpiration = '2h'): Promise<string | null> {
    
    return new Promise((resolve) => {
      
      jwt.sign(payload, JWT_SEED, { expiresIn: duration }, (err, token) => {
        if(err) return resolve(null);

        resolve(token!)
      })
    })
  }
  

}