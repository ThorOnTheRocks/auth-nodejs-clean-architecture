import { Validators } from "../../../../validators/validators";

export class LoginUserDTO {
  constructor(
    public readonly email: string,
    public readonly password: string,
  ) {}

  static create(object: { [key: string]: string }): [string?, LoginUserDTO?] {
    const { email, password } = object;

    if (!email) return ["Email is missing"];
    if (!Validators.email.test(email)) return ["Email is invalid format"];
    if (!password) return ["Password is missing"];
    if (password.length < 6)
      return ["Password must be minimum of 6 characters"];

    return [undefined, new LoginUserDTO(email, password)];
  }
}
