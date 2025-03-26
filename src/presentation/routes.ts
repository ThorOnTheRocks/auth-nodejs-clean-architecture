import { Router } from "express";
import { AuthRoutes } from "./auth/routes";
import { OAuthRoutes } from "./oauth/routes";
import { ProfileRoutes } from "./profile/routes";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    // Define all your app routes
    router.use("/api/auth", AuthRoutes.routes);
    router.use("/api/oauth", OAuthRoutes.routes);
    router.use("/api/profile", ProfileRoutes.routes);

    return router;
  }
}
