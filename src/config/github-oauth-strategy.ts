import { Strategy as GithubStrategy, Profile } from "passport-github2";

interface GithubOauthOptions {
  clientID: string;
  clientSecret: string;
  callbackURL: string;
  scope?: string[];
}

type VerifyFunction = (
  accessToken: string, 
  refreshToken: string, 
  profile: Profile, 
  done: (err?: Error | null | unknown, user?: Express.User | false, info?: object) => void
) => void;

export class GithubOauthAdapter {
  static createStrategy(options: GithubOauthOptions, verifyCallback: VerifyFunction): GithubStrategy {
    return new GithubStrategy({
      clientID: options.clientID,
      clientSecret: options.clientSecret,
      callbackURL: options.callbackURL,
      scope: options.scope || ['profile', 'email']
    },
    verifyCallback
    )
  }
}