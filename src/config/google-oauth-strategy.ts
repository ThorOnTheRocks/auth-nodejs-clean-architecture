import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";

interface GoogleOauthOptions {
  clientID: string;
  clientSecret: string;
  callbackURL: string;
  scope?: string[];
}

type VerifyFunction = (
  accessToken: string,
  refreshToken: string,
  profile: Profile,
  done: VerifyCallback,
) => void;

export class GoogleOauthAdapter {
  static createStrategy(
    options: GoogleOauthOptions,
    verifyCallback: VerifyFunction,
  ): GoogleStrategy {
    return new GoogleStrategy(
      {
        clientID: options.clientID,
        clientSecret: options.clientSecret,
        callbackURL: options.callbackURL,
        scope: options.scope || ["profile", "email"],
      },
      verifyCallback,
    );
  }
}
