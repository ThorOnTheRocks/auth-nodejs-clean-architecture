import { Request, Response, NextFunction } from "express";
import { envs, JWTAdapter } from "../../../../config";
import { PostgresDatabase } from "../../../../database/postgres/postgres.database";
import { User } from "../../../../database/postgres/models/user.model";
import { UserModel } from "../../../../database/mongodb";

export class AuthMiddleware {
  static validateJWT = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const authorization = req.header("Authorization");
    if (!authorization) {
      res.status(401).json({ error: "No token provided" });
      return;
    }
    if (!authorization.startsWith("Bearer ")) {
      res.status(401).json({ error: "Invalid token!" });
      return;
    }

    const token = authorization.split(" ").at(1) || "";

    try {
      const payload = await JWTAdapter.validateToken<{ id: string }>(token);
      if (!payload) {
        res.status(401).json({ error: "Invalid token" });
        return;
      }

      let user;

      if (envs.DATABASE_TYPE === "postgres") {
        const userRepository =
          PostgresDatabase.appDataSource.getRepository(User);
        user = await userRepository.findOne({ where: { id: payload.id } });
      } else {
        user = await UserModel.findById(payload.id);
      }

      if (!user) {
        res.status(401).json({ error: "User does not exist" });
        return;
      }

      if (user.isLocked) {
        if (user.lockedUntil && user.lockedUntil > new Date()) {
          // Temporary lock is still active
          res.status(403).json({
            error: "Account locked",
            message:
              "Your account is temporarily locked. Please try again later or reset your password.",
            lockedUntil: user.lockedUntil,
          });
          return;
        } else if (!user.lockedUntil) {
          // Permanent lock by admin
          res.status(403).json({
            error: "Account locked",
            message:
              "Your account has been locked. Please contact support for assistance.",
          });
          return;
        }
        // If we get here, the lock has expired but isLocked is still true
        // We could auto-unlock here, but that might be better handled elsewhere
      }

      req.body.user = user;

      next();
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
      next(error);
    }
  };
}
