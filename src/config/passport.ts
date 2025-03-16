import passport, { Strategy } from "passport";
import { Request, Response, NextFunction } from "express";

interface AuthOptions {
  successRedirect?: string;
  failureRedirect?: string;
  scope?: string[];
  session?: boolean;
  passReqToCallback?: boolean;
}

interface CallbackOptions {
  successRedirect?: string;
  failureRedirect?: string;
  failureMessage?: string;
  session?: boolean;
}

export interface NormalizedProfile {
  id: string;
  provider: string;
  email?: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  photoUrl?: string;
  raw?: any;
}

export class PassportAdapter {
  static initialize() {
    return passport.initialize();
  }

  static session() {
    return passport.session();
  }

  static serializeUser(
    callback: (user: any, done: (err: any, id: any) => void) => void,
  ) {
    return passport.serializeUser(callback);
  }

  static deserializeUser(
    callback: (id: any, done: (err: any, user: any) => void) => void,
  ) {
    return passport.deserializeUser(callback);
  }

  static registerStrategy(name: string, strategy: Strategy) {
    return passport.use(name, strategy);
  }

  static authenticate(strategy: string, options: AuthOptions = {}) {
    return passport.authenticate(strategy, options);
  }

  static handleCallback(
    strategy: string,
    options: CallbackOptions = {},
    callback?: (req: Request, res: Response, next: NextFunction) => void,
  ) {
    if (callback) {
      return passport.authenticate(
        strategy,
        { session: options.session },
        callback,
      );
    }
    return passport.authenticate(strategy, options);
  }

  static logout() {
    return (req: Request, res: Response, next: NextFunction) => {
      req.logout((err) => {
        if (err) return next(err);
        next();
      });
    };
  }
}
