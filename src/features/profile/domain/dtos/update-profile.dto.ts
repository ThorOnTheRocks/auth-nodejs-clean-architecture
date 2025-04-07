import { Validators } from "../../../../validators/validators";

export class UpdateProfileDTO {
  private constructor(
    public userId: string,
    public name?: string,
    public email?: string,
  ) {}

  static create(object: {
    userId: string;
    name?: string;
    email?: string;
  }): [string?, UpdateProfileDTO?] {
    const { userId, name, email } = object;

    if (!userId) return ["User ID is missing"];

    // At least one field must be provided
    if (!name && !email) return ["At least one field must be provided"];

    // Validate email if provided
    if (email && !Validators.email.test(email)) {
      return ["Email is invalid format"];
    }

    return [undefined, new UpdateProfileDTO(userId, name, email)];
  }
}
