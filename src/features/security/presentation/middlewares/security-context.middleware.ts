import { Request, Response, NextFunction } from "express";

interface SecurityRequest extends Request {
  securityContext: {
    ipAddress: string | null;
    userAgent: string | null;
  };
}

// Store IP and user agent in request object for later use
export class SecurityContextMiddleware {
  static captureContext = (
    req: Request,
    res: Response,
    next: NextFunction,
  ): void => {
    const secReq = req as SecurityRequest;

    // Add security context to request
    secReq.securityContext = {
      ipAddress: req.ip || null,
      userAgent: req.headers["user-agent"] || null,
    };

    next();
  };
}
