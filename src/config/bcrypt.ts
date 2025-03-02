import { hashSync, compareSync } from "bcryptjs";

export class BcryptAdapter {

  static hash(password: string) {
    return hashSync(password)
  }

  static compare(password: string, hashedPassword: string) {
    return compareSync(password, hashedPassword)
  }
} 