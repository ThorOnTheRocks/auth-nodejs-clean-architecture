import { OauthProvider } from "../../domain/entities/authMethod.entity";
import { OauthProfileDTO } from "../../domain/dtos/auth/oauth-profile.dto";
import { CustomError } from "../../domain/errors/errors";
import { Profile as GoogleProfile } from "passport-google-oauth20";
import { Profile as GithubProfile } from "passport-github2";

export class OAuthProfileMapper {
  static fromGoogleProfile(profile: unknown): OauthProfileDTO {
    const googleProfile = profile as GoogleProfile;

    const [error, profileDTO] = OauthProfileDTO.create({
      name: googleProfile.displayName || "Google User",
      email: googleProfile.emails?.[0]?.value || "",
      oauthProvider: "google" as OauthProvider,
      providerId: googleProfile.id,
      picture: googleProfile.photos?.[0]?.value,
      metadata: {
        firstName: googleProfile.name?.givenName,
        lastName: googleProfile.name?.familyName,
      },
    });

    if (error) throw CustomError.badRequest(error);
    return profileDTO!;
  }

  static fromGithubProfile(profile: unknown): OauthProfileDTO {
    const githubProfile = profile as GithubProfile;

    const [error, profileDTO] = OauthProfileDTO.create({
      name:
        githubProfile.displayName || githubProfile.username || "GitHub User",
      email: githubProfile.emails?.[0]?.value || "",
      oauthProvider: "github" as OauthProvider,
      providerId: githubProfile.id,
      picture: githubProfile.photos?.[0]?.value,
      metadata: {
        username: githubProfile.username,
      },
    });

    if (error) throw CustomError.badRequest(error);
    return profileDTO!;
  }
}
