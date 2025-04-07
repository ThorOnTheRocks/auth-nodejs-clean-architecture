import { Router } from "express";
import { AuthRoutes } from "../features/auth/presentation/routes/auth.routes";
import { OAuthRoutes } from "../features/oauth/presentation/routes/oauth.routes";
import { ProfileRoutes } from "../features/profile/presentation/routes/profile.routes";
import { VerificationRoutes } from "../features/verification/presentation/routes/verification.routes";
import { PasswordResetRoutes } from "../features/password-reset/presentation/routes/password-reset.routes";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    // Define all your app routes
    router.use("/api/auth", AuthRoutes.routes);
    router.use("/api/oauth", OAuthRoutes.routes);
    router.use("/api/profile", ProfileRoutes.routes);
    router.use("/api/verification", VerificationRoutes.routes);
    router.use("/api/password-reset", PasswordResetRoutes.routes);

    return router;
  }
}
