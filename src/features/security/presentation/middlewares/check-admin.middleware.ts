import { Request, Response, NextFunction } from "express";

export class AdminMiddleware {
  static isAdmin = (req: Request, res: Response, next: NextFunction) => {
    const user = req.body?.user;

    if (
      !user ||
      !user.roles ||
      !Array.isArray(user.roles) ||
      !user.roles.includes("ADMIN_ROLE")
    ) {
      res.status(403).json({ error: "Unauthorized: Admin access required" });
      return;
    }

    next();
  };
}
