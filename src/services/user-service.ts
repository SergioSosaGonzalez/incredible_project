import {UserService} from '@loopback/authentication';
import {UserProfile, securityId} from '@loopback/security';
import {User} from '../models';
import {Credentials, UserRepository} from '../repositories';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {inject} from '@loopback/core';
import {BcryptHasher} from './hasg.password.bcrypt';
import {PasswordHasherBindings} from '../keys';

export class MyUserService implements UserService<User, Credentials> {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public hasher: BcryptHasher,
  ) {}

  async verifyCredentials(credentials: Credentials): Promise<User> {
    const founUser = await this.userRepository.findOne({
      where: {
        email: credentials.email,
      },
    });
    if (!founUser) throw new HttpErrors.NotFound('Email not found');

    const passwordMatched = await this.hasher.comparePassword(
      credentials.password,
      founUser.password,
    );
    if (!passwordMatched)
      throw new HttpErrors.Unauthorized('Password incorrect');

    return founUser;
  }
  convertToUserProfile(user: User): UserProfile {
    /*let userName = '';
    if (user.firstName) {
      userName = user.firstName;
    }
    if (user.lastname) {
      userName = user.firstName
        ? `${user.firstName} ${user.lastname}`
        : user.lastname;
    }*/
    throw new HttpErrors.NotAcceptable('No funciona');
  }
}
