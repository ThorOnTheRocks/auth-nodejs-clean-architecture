declare namespace Express {
  interface Request {
    securityContext?: {
      ipAddress: string | null;
      userAgent: string | null;
    };
  }
}
