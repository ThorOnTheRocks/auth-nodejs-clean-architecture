import { Validators } from "../../../../validators/validators";

export class ResetPasswordDTO {
  private constructor(
    public token: string,
    public newPassword: string,
  ) {}

  static create(object: {
    token?: string;
    newPassword?: string;
  }): [string?, ResetPasswordDTO?] {
    const { token, newPassword } = object;

    if (!token) return ["Reset token is missing"];
    if (!newPassword) return ["New password is missing"];
    const validation = Validators.validatePassword(newPassword);
    if (!validation.isValid) {
      return [validation.error];
    }

    return [undefined, new ResetPasswordDTO(token, newPassword)];
  }
}
