import { Validators } from "../../../../validators/validators";

export class ChangePasswordDTO {
  private constructor(
    public userId: string,
    public currentPassword: string,
    public newPassword: string,
  ) {}

  static create(object: {
    userId?: string;
    currentPassword?: string;
    newPassword?: string;
  }): [string?, ChangePasswordDTO?] {
    const { userId, currentPassword, newPassword } = object;

    if (!userId) return ["User ID is missing"];
    if (!currentPassword) return ["Current password is missing"];

    // Validate new password
    if (!newPassword) return ["New password is missing"];

    const validation = Validators.validatePassword(newPassword);
    if (!validation.isValid) {
      return [validation.error];
    }

    if (currentPassword === newPassword) {
      return ["New password must be different from current password"];
    }

    return [
      undefined,
      new ChangePasswordDTO(userId, currentPassword, newPassword),
    ];
  }
}
