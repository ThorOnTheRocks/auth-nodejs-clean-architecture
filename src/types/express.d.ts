import { Express } from "express";

declare global {
  namespace Express {
    interface Request {
      securityContext?: {
        ipAddress: string | null;
        userAgent: string | null;
      };
    }
  }
}
