import { Request, Response, NextFunction } from "express";

// Store IP and user agent in request object for later use
export class SecurityContextMiddleware {
  static captureContext = (
    req: Request,
    res: Response,
    next: NextFunction,
  ): void => {
    // Add security context to request
    req.securityContext = {
      ipAddress: req.ip || null,
      userAgent: req.headers["user-agent"] || null,
    };

    next();
  };
}
