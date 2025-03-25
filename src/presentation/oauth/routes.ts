import { Router } from "express";
import { envs } from "../../config";
import { PassportAdapter } from "../../config/passport";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { OAuthController } from "./controller";
import { DatabaseFactory } from "../../infrastructure/factories/database.factory";
import { OAuthRepositoryImpl } from "../../infrastructure/repository/oauth.repository.impl";
import { RefreshTokenRepositoryImpl } from "../../infrastructure/repository/refresh-token.repository.impl";
import { GoogleOauthAdapter } from "../../config/google-oauth-strategy";
import { GithubOauthAdapter } from "../../config/github-oauth-strategy";

export class OAuthRoutes {
  static get routes(): Router {
    const router = Router();

    const oauthDataSource = DatabaseFactory.createOAuthDataSource(
      envs.DATABASE_TYPE,
    );
    const refreshTokenDataSource = DatabaseFactory.createRefreshTokenDataSource(
      envs.DATABASE_TYPE,
    );

    const oauthRepository = new OAuthRepositoryImpl(oauthDataSource);
    const refreshTokenRepository = new RefreshTokenRepositoryImpl(
      refreshTokenDataSource,
    );

    const controller = new OAuthController(
      oauthRepository,
      refreshTokenRepository,
    );

    const googleStrategy = GoogleOauthAdapter.createStrategy(
      {
        clientID: envs.GOOGLE_CLIENT_ID,
        clientSecret: envs.GOOGLE_CLIENT_SECRET,
        callbackURL: envs.GOOGLE_CALLBACK_URL,
      },
      (accessToken, refreshToken, profile, done) => {
        // Passing the profile to the controller
        done(null, profile);
      },
    );

    const githubStrategy = GithubOauthAdapter.createStrategy(
      {
        clientID: envs.GITHUB_CLIENT_ID,
        clientSecret: envs.GITHUB_CLIENT_SECRET,
        callbackURL: envs.GITHUB_CALLBACK_URL,
      },
      (accessToken, refreshToken, profile, done) => {
        // Passing the profile to the controller
        done(null, profile);
      },
    );

    PassportAdapter.registerStrategy("google", googleStrategy);
    PassportAdapter.registerStrategy("github", githubStrategy);

    router.get(
      "/google",
      PassportAdapter.authenticate("google", { scope: ["profile", "email"] }),
    );

    router.get(
      "/google/callback",
      PassportAdapter.handleCallback("google", {
        failureRedirect: "/auth-failed",
      }),
      controller.handleGoogleCallback,
    );

    router.get(
      "/github",
      PassportAdapter.authenticate("github", { scope: ["user:email"] }),
    );

    router.get(
      "/github/callback",
      PassportAdapter.handleCallback("github", {
        failureRedirect: "/auth-failed",
      }),
      controller.handleGithubCallback,
    );

    router.get(
      "/methods",
      [AuthMiddleware.validateJWT],
      controller.getUserAuthMethods,
    );

    router.post("/link", [AuthMiddleware.validateJWT], controller.linkAccount);

    router.delete(
      "/unlink/:provider",
      [AuthMiddleware.validateJWT],
      controller.unlinkAccount,
    );

    return router;
  }
}
