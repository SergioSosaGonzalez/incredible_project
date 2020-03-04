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

export class AdminController {
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
  @post('/admin', {
    responses: {
      '200': {
        description: 'Admin',
        content: {
          schema: getJsonSchemaRef(User),
        },
      },
    },
  })
  async create(@requestBody() admin: User) {
    validateCredentials(_.pick(admin, ['email', 'password']));
    admin.permission = [
      Permissionkeys.CreateJob,
      Permissionkeys.UpdateJob,
      Permissionkeys.DeleteJob,
    ];
    //Encriptar
    admin.password = await this.hasher.hashPassword(admin.password);

    const savedAdmin = await this.userRepository.create(admin);
    delete savedAdmin.password;
    return savedAdmin;
  }
}
