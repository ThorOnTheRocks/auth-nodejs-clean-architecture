import { RefreshAccessToken } from "../../../token/domain/use-cases/refresh-access-token.use-case";
import { LoginUserDTO } from "../../domain/dtos/login-user.dto";
import { Request, Response } from "express";
import {
  AuthRepository,
  CustomError,
  GenerateRefreshToken,
  RefreshTokenRepository,
  RegisterUser,
  RegisterUserDTO,
  RevokeAllUserTokens,
  RevokeRefreshToken,
} from "../../../../domain/index";
import { envs, JWTAdapter } from "../../../../config";
import { LoginUser } from "../../domain/use-cases/login-user-use-case";
import { PostgresDatabase } from "../../../../database/postgres/postgres.database";
import { User } from "../../../../database/postgres/models/user.model";
import { UserModel } from "../../../../database/mongodb";
import { UserRepository } from "../../domain/repositories/user.repository";
import { SendVerificationEmail } from "../../../verification/domain/use-cases/send-verification-email.use-case";
import { EmailRepository } from "../../../email/domain/repositories/email.repository";
import { VerificationTokenRepository } from "../../../verification/domain/repositories/verification-token.repository";
import { ChangePasswordDTO } from "../../domain/dtos/change-password.dto";
import { ChangePassword } from "../../domain/use-cases/change-password.use-case";

export class AuthController {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly verificationTokenRepository: VerificationTokenRepository,
    private readonly emailRepository: EmailRepository,
  ) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  };

  registerUser = (req: Request, res: Response) => {
    const [error, registerUserDTO] = RegisterUserDTO.create(req.body);
    if (error) {
      res.status(400).json({ error });
      return;
    }

    new RegisterUser(this.authRepository, JWTAdapter.generateToken)
      .execute(registerUserDTO!)
      .then((data) => {
        // Generate refresh token
        return new GenerateRefreshToken(this.refreshTokenRepository)
          .execute(data.user.id, req.headers["user-agent"], req.ip)
          .then((refreshToken) => {
            res.cookie("refresh_token", refreshToken.token, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "strict",
              maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });

            // Send verification email
            new SendVerificationEmail(
              this.verificationTokenRepository,
              this.emailRepository,
              this.userRepository,
            )
              .execute(data.user.id)
              .catch((error) =>
                console.error("Error sending verification email:", error),
              );

            return res.json({
              ...data,
              verificationEmailSent: true,
            });
          });
      })
      .catch((error) => this.handleError(error, res));
  };

  loginUser = (req: Request, res: Response) => {
    const [error, loginUserDTO] = LoginUserDTO.create(req.body);
    if (error) {
      res.status(400).json({ error });
      return;
    }

    new LoginUser(this.authRepository, JWTAdapter.generateToken)
      .execute(loginUserDTO!)
      .then((data) => {
        return new GenerateRefreshToken(this.refreshTokenRepository)
          .execute(data.user.id, req.headers["user-agent"], req.ip)
          .then((refreshToken) => {
            res.cookie("refresh_token", refreshToken.token, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "strict",
              maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });
            return res.json(data);
          });
      })
      .catch((error) => this.handleError(error, res));
  };

  getUsers = (req: Request, res: Response) => {
    if (envs.DATABASE_TYPE === "postgres") {
      const userRepository = PostgresDatabase.appDataSource.getRepository(User);

      userRepository
        .find()
        .then((users) =>
          res.json({
            users,
          }),
        )

        .catch(() => res.status(500).json({ error: "Internal server error" }));
    } else {
      UserModel.find()
        .then((users) =>
          res.json({
            users,
          }),
        )
        .catch(() => res.status(500).json({ error: "Internal server error" }));
    }
  };

  refreshToken = (req: Request, res: Response) => {
    const refreshToken = req.cookies["refresh_token"];

    if (!refreshToken) {
      res.status(401).json({ error: "No refresh token provided" });
      return;
    }

    new RefreshAccessToken(
      this.refreshTokenRepository,
      this.userRepository,
      JWTAdapter.generateToken,
    )
      .execute(refreshToken)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(error, res));
  };

  logout = (req: Request, res: Response) => {
    const refreshToken = req.cookies["refresh_token"];

    if (!refreshToken) {
      res.status(401).json({ error: "No refresh token provided" });
      return;
    }

    new RevokeRefreshToken(this.refreshTokenRepository)
      .execute(refreshToken)
      .then(() => {
        res.clearCookie("refresh_token");
        res.json({ message: "Logged out successfully" });
      })
      .catch((error) => this.handleError(error, res));
  };

  logoutAll = (req: Request, res: Response) => {
    const userId = req.body.user.id;

    new RevokeAllUserTokens(this.refreshTokenRepository)
      .execute(userId)
      .then(() => {
        res.clearCookie("refresh_token");
        res.json({ message: "Logged out from all devices" });
      })
      .catch((error) => this.handleError(error, res));
  };

  changePassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.body.user.id;

      const [error, changePasswordDTO] = ChangePasswordDTO.create({
        userId,
        currentPassword: req.body.currentPassword,
        newPassword: req.body.newPassword,
      });

      if (error) {
        res.status(400).json({ error });
        return;
      }

      await new ChangePassword(this.userRepository).execute(changePasswordDTO!);

      res.json({
        success: true,
        message: "Password has been changed successfully",
      });
    } catch (error) {
      this.handleError(error, res);
    }
  };
}
