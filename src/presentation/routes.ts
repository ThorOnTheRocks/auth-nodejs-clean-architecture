import { Router } from "express";
import { AuthRoutes } from "../features/auth/presentation/routes/auth.routes";
import { OAuthRoutes } from "../features/oauth/presentation/routes/oauth.routes";
import { ProfileRoutes } from "../features/profile/presentation/routes/profile.routes";
import { VerificationRoutes } from "../features/verification/presentation/routes/verification.routes";
import { PasswordResetRoutes } from "../features/password-reset/presentation/routes/password-reset.routes";
import { SecurityRoutes } from "../features/security/presentation/routes/security.routes";
import { AdminSecurityRoutes } from "../features/security/presentation/routes/admin-security.routes";
import { DeviceRoutes } from "../features/security/presentation/routes/device.routes";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    // Define all your app routes
    router.use("/api/auth", AuthRoutes.routes);
    router.use("/api/oauth", OAuthRoutes.routes);
    router.use("/api/profile", ProfileRoutes.routes);
    router.use("/api/verification", VerificationRoutes.routes);
    router.use("/api/password-reset", PasswordResetRoutes.routes);
    router.use("/api/security", SecurityRoutes.routes);
    router.use("/api/admin/security", AdminSecurityRoutes.routes);
    router.use("/api/devices", DeviceRoutes.routes);

    return router;
  }
}
