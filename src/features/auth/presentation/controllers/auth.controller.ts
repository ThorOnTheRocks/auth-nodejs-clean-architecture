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
import { SecurityLoggerService } from "../../../../features/security/application/security-logger.service";
import { SecurityEventType } from "../../../../features/security/domain/entities/security-event.entity";
import { BruteForceProtectionService } from "../../../security/application/brute-force-protection.service";
import { DeviceManagementService } from "../../../security/application/device-management.service";

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

  registerUser = async (req: Request, res: Response) => {
    try {
      const [error, registerUserDTO] = RegisterUserDTO.create(req.body);
      if (error) {
        res.status(400).json({ error });
        return;
      }

      const data = await new RegisterUser(
        this.authRepository,
        JWTAdapter.generateToken,
      ).execute(registerUserDTO!);

      // Generate refresh token
      const refreshToken = await new GenerateRefreshToken(
        this.refreshTokenRepository,
      ).execute(data.user.id, req.headers["user-agent"], req.ip);

      res.cookie("refresh_token", refreshToken.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // Register the first device (this won't send a notification since it's the first login)
      await DeviceManagementService.getInstance().registerInitialDevice(
        data.user.id,
        req.headers["user-agent"] || null,
        req.ip || null,
      );

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

      // Log successful registration
      SecurityLoggerService.getInstance().logEvent(
        data.user.id,
        SecurityEventType.LOGIN_SUCCESS,
        req.ip || null,
        req.headers["user-agent"] || null,
        { action: "registration", isFirstLogin: true },
      );

      res.json({
        ...data,
        verificationEmailSent: true,
      });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  loginUser = async (req: Request, res: Response) => {
    try {
      const [error, loginUserDTO] = LoginUserDTO.create(req.body);
      if (error) {
        res.status(400).json({ error });
        return;
      }

      // Check for brute force attempts before even trying to authenticate
      await BruteForceProtectionService.getInstance().check(
        loginUserDTO!.email,
        req.ip || null,
      );

      const data = await new LoginUser(
        this.authRepository,
        JWTAdapter.generateToken,
      ).execute(loginUserDTO!);

      const refreshToken = await new GenerateRefreshToken(
        this.refreshTokenRepository,
      ).execute(data.user.id, req.headers["user-agent"], req.ip);

      await BruteForceProtectionService.getInstance().recordSuccess(
        loginUserDTO!.email,
        data.user.id,
        req.ip || null,
        req.headers["user-agent"] || null,
      );

      const isNewDevice =
        await DeviceManagementService.getInstance().checkDevice(
          data.user.id,
          req.headers["user-agent"] || null,
          req.ip || null,
        );

      SecurityLoggerService.getInstance().logEvent(
        data.user.id,
        SecurityEventType.LOGIN_SUCCESS,
        req.ip || null,
        req.headers["user-agent"] || null,
        {
          action: "login",
          newDevice: isNewDevice,
        },
      );

      res.cookie("refresh_token", refreshToken.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.json({
        ...data,
        security: {
          newDevice: isNewDevice,
        },
      });
    } catch (error) {
      if (
        error instanceof CustomError &&
        (error.statusCode === 400 || error.statusCode === 401)
      ) {
        // Extract email from request if available
        const email = req.body.email;
        if (email) {
          BruteForceProtectionService.getInstance().recordFailure(
            email,
            req.ip || null,
            req.headers["user-agent"] || null,
          );
        }
      }

      this.handleError(error, res);
    }
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

        SecurityLoggerService.getInstance().logEvent(
          req.body.user.id,
          SecurityEventType.TOKEN_REVOKED,
          req.ip || null,
          req.headers["user-agent"] || null,
          { action: "logout" },
        );
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

        SecurityLoggerService.getInstance().logEvent(
          req.body.user.id,
          SecurityEventType.TOKEN_REVOKED,
          req.ip || null,
          req.headers["user-agent"] || null,
          { action: "logout_all_devices" },
        );
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

      SecurityLoggerService.getInstance().logEvent(
        userId,
        SecurityEventType.PASSWORD_CHANGE,
        req.ip || null,
        req.headers["user-agent"] || null,
        null,
      );
    } catch (error) {
      this.handleError(error, res);
    }
  };
}
