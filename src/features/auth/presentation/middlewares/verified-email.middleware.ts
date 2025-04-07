import { Request, Response, NextFunction } from "express";
import { User } from "../../../../database/postgres/models/user.model";
import { UserModel } from "../../../../database/mongodb";
import { envs } from "../../../../config";
import { PostgresDatabase } from "../../../../database/postgres/postgres.database";

export class VerifiedEmailMiddleware {
  static requireVerifiedEmail = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.body.user?.id;

      if (!userId) {
        res.status(401).json({ error: "Authentication required" });
        return;
      }

      let user: User | null;

      if (envs.DATABASE_TYPE === "postgres") {
        const userRepository =
          PostgresDatabase.appDataSource.getRepository(User);
        user = await userRepository.findOne({ where: { id: userId } });
      } else {
        user = await UserModel.findById(userId);
      }

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      if (!user.isVerified) {
        res.status(403).json({
          error: "Email verification required",
          message:
            "Please verify your email address before accessing this resource",
        });
        return;
      }

      next();
    } catch (error) {
      console.error("Error in verified email middleware:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
}
