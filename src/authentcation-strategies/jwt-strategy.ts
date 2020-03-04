import {AuthenticationStrategy} from '@loopback/authentication';
import {Request, HttpErrors} from '@loopback/rest';
import {inject} from '@loopback/core';
import {TokenServiceBindings} from '../keys';
import {JWTService} from '../services/jwt-service';

export class JWTStrategy implements AuthenticationStrategy {
  constructor(
    @inject('services.jwt.service')
    public jwtService: JWTService,
  ) {}

  name: string = 'jwt';
  async authenticate(request: Request): Promise<any> {
    const token: string = this.extractCredentials(request);
    const userProfile = await this.jwtService.verifyToken(token);
    return Promise.resolve(userProfile);
  }

  extractCredentials(request: Request): string {
    if (!request.headers.authorization) {
      throw new HttpErrors.Unauthorized('Authorization header is missing');
    }
    const authHeaderValue = request.headers.authorization;

    //Authorization
    if (!authHeaderValue.startsWith('Bearer')) {
      throw new HttpErrors.Unauthorized(
        'Authorization header is not type of Bearer',
      );
    }

    const parts = authHeaderValue.split(' ');
    if (parts.length !== 2) {
      throw new HttpErrors.Unauthorized(
        `Authorization header has too many parts it must follow this pattern 'Bearer xx.yy.zzz'`,
      );
    }
    const token = parts[1];
    return token;
  }
}
