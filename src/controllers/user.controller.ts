import {repository} from '@loopback/repository';
import {User} from '../models/user.model';
import {UserRepository, Credentials} from '../repositories';
import {post, getJsonSchemaRef, requestBody, get} from '@loopback/rest';
import {validateCredentials} from '../services/validator';
import * as _ from 'lodash';
import {inject} from '@loopback/core';
import {BcryptHasher} from '../services/hasg.password.bcrypt';
import {CredentialsRequestBody} from '../specs/user.controller.spec';
import {MyUserService} from '../services/user-service';
import {JWTService} from '../services/jwt-service';
import {PasswordHasherBindings, UserServiceBindings} from '../keys';
import {authenticate, AuthenticationBindings} from '@loopback/authentication';
import {Permissionkeys} from '../authorization/permission-keys';

// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/context';

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public hasher: BcryptHasher,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
    @inject('services.jwt.service')
    public jwtService: JWTService,
  ) {}
  @post('/users/signup', {
    responses: {
      '200': {
        description: 'User',
        content: {
          schema: getJsonSchemaRef(User),
        },
      },
    },
  })
  async signup(@requestBody() userData: User) {
    validateCredentials(_.pick(userData, ['email', 'password']));
    userData.permission = [Permissionkeys.AccessAuthFeature];
    //Encriptar
    userData.password = await this.hasher.hashPassword(userData.password);

    const savedUser = await this.userRepository.create(userData);
    delete savedUser.password;
    return savedUser;
  }

  @post('/users/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<{token: string}> {
    const user = await this.userService.verifyCredentials(credentials);
    delete user.password;
    console.log(user);
    const token = await this.jwtService.generateToken(user);
    return Promise.resolve({token});
  }

  @get('/users/me')
  @authenticate('jwt')
  async me(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: User,
  ): Promise<any> {
    console.log(currentUser);
    return Promise.resolve(currentUser);
  }
}
