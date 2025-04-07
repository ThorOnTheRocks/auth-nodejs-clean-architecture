import { Validators } from "../../../../validators/validators";

export class RequestPasswordResetDTO {
  private constructor(public email: string) {}

  static create(object: {
    email?: string;
  }): [string?, RequestPasswordResetDTO?] {
    const { email } = object;

    if (!email) return ["Email is missing"];
    if (!Validators.email.test(email)) return ["Email is invalid format"];

    return [undefined, new RequestPasswordResetDTO(email)];
  }
}
