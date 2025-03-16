import { RefreshAccessToken } from "./../../domain/use-cases/refresh-access-token.use-case";
import { LoginUserDTO } from "./../../domain/dtos/auth/login-user.dto";
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
} from "../../domain/index";
import { envs, JWTAdapter } from "../../config";
import { LoginUser } from "../../domain/use-cases/login-user-use-case";
import { PostgresDatabase } from "../../data/postgres/postgres.database";
import { User } from "../../data/postgres/models/user.model";
import { UserModel } from "../../data/mongodb";
import { UserRepository } from "../../domain/repository/user.repository";

export class AuthController {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
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
}
