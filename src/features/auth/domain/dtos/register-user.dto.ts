import { Validators } from "../../../../validators/validators";

export class RegisterUserDTO {
  private constructor(
    public name: string,
    public email: string,
    public password: string,
  ) {}

  static create(object: {
    name?: string;
    email?: string;
    password?: string;
  }): [string?, RegisterUserDTO?] {
    const { name, email, password } = object;

    if (!name) return ["Name is missing"];
    if (!email) return ["Email is missing"];
    if (!Validators.email.test(email)) return ["Email is invalid format"];
    if (!password) return ["Password is missing"];
    const validation = Validators.validatePassword(password);
    if (!validation.isValid) {
      return [validation.error];
    }

    return [undefined, new RegisterUserDTO(name, email, password)];
  }
}
