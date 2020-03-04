import {genSalt, hash, compare} from 'bcryptjs';

export interface PasswordHasher<T = string> {
  hashPassword(password: T): Promise<T>;
  comparePassword(providedPass: T, storePass: T): Promise<boolean>;
}

export class BcryptHasher implements PasswordHasher<string> {
  async comparePassword(
    providedPass: string,
    storePass: string,
  ): Promise<boolean> {
    const passwordMatched = await compare(providedPass, storePass);
    return passwordMatched;
  }
  round: number = 10;
  async hashPassword(password: string) {
    const salt = await genSalt(this.round);
    return await hash(password, salt);
  }
}
