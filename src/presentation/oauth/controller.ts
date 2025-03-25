import { Request, Response } from "express";
import { CustomError } from "../../domain/errors/errors";
import { OAuthRepository } from "../../domain/repository/oauth.repository";
import { OAuthAuthentication } from "../../domain/use-cases/oauth-use-case";
import { JWTAdapter } from "../../config";
import { OAuthProfileMapper } from "../../infrastructure/mappers/oauth-profile.mapper";
import { GetUserAuthMethods } from "../../domain/use-cases/get-user-auth-method-use-case";
import { LinkOAuthAccount } from "../../domain/use-cases/link-account-use-case";
import { UnlinkOAuthAccount } from "../../domain/use-cases/unlink-account-use-case";
import { LinkAccountDTO } from "../../domain/dtos/auth/link-account.dto";
import { RefreshTokenRepository } from "../../domain/repository/refresh-token.repository";
import { GenerateRefreshToken } from "../../domain/use-cases/generate-refresh-token.use-case";

export class OAuthController {
  constructor(
    private readonly oauthRepository: OAuthRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  private handleError(error: unknown, res: Response): void {
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }

  handleGoogleCallback = (req: Request, res: Response): void => {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Authentication failed" });
        return;
      }

      const profile = OAuthProfileMapper.fromGoogleProfile(req.user);

      new OAuthAuthentication(this.oauthRepository, JWTAdapter.generateToken)
        .execute("google", profile)
        .then((data) => {
          new GenerateRefreshToken(this.refreshTokenRepository)
            .execute(
              data.user.id,
              req.headers["user-agent"] as string | undefined,
              req.ip,
            )
            .then((refreshToken) => {
              res.cookie("refresh_token", refreshToken.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
              });

              res.redirect(`/auth-success?token=${data.token}`);
            })
            .catch((error) => this.handleError(error, res));
        })
        .catch((error) => this.handleError(error, res));
    } catch (error) {
      this.handleError(error, res);
    }
  };

  handleGithubCallback = (req: Request, res: Response): void => {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Authentication failed" });
        return;
      }

      const profile = OAuthProfileMapper.fromGithubProfile(req.user);

      new OAuthAuthentication(this.oauthRepository, JWTAdapter.generateToken)
        .execute("github", profile)
        .then((data) => {
          new GenerateRefreshToken(this.refreshTokenRepository)
            .execute(
              data.user.id,
              req.headers["user-agent"] as string | undefined,
              req.ip,
            )
            .then((refreshToken) => {
              res.cookie("refresh_token", refreshToken.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
              });

              res.redirect(`/auth-success?token=${data.token}`);
            })
            .catch((error) => this.handleError(error, res));
        })
        .catch((error) => this.handleError(error, res));
    } catch (error) {
      this.handleError(error, res);
    }
  };

  getUserAuthMethods = (req: Request, res: Response): void => {
    const userId = req.body.user.id;

    new GetUserAuthMethods(this.oauthRepository)
      .execute(userId)
      .then((authMethods) => {
        res.json({ authMethods });
      })
      .catch((error) => this.handleError(error, res));
  };

  linkAccount = (req: Request, res: Response): void => {
    const [error, linkAccountDTO] = LinkAccountDTO.create({
      ...req.body,
      userId: req.body.user.id,
    });

    if (error) {
      res.status(400).json({ error });
      return;
    }

    new LinkOAuthAccount(this.oauthRepository)
      .execute(linkAccountDTO!)
      .then((authMethod) => {
        res.json({ authMethod });
      })
      .catch((error) => this.handleError(error, res));
  };

  unlinkAccount = (req: Request, res: Response): void => {
    const userId = req.body.user.id;
    const { provider } = req.params;

    new UnlinkOAuthAccount(this.oauthRepository)
      .execute(userId, provider)
      .then((success) => {
        if (success) {
          res.json({ message: "Provider unlinked successfully" });
        } else {
          res.status(400).json({ error: "Failed to unlink provider" });
        }
      })
      .catch((error) => this.handleError(error, res));
  };
}
