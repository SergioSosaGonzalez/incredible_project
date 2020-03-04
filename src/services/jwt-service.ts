import {promisify} from 'util';
import {HttpErrors} from '@loopback/rest';
import {User} from '../models';
import {inject} from '@loopback/core';
import {TokenServiceBindings} from '../keys';
const jwt = require('jsonwebtoken');
const signAsync = promisify(jwt.sign);
const verifyAsync = promisify(jwt.verify);
export class JWTService {
  @inject(TokenServiceBindings.TOKEN_SECRET)
  public readonly jwtSecret: string;
  @inject(TokenServiceBindings.TOKEN_EXPIRES_IN)
  public readonly jwtExpiresIn: string;
  async generateToken(userProfile: User): Promise<string> {
    if (!userProfile)
      throw new HttpErrors.Unauthorized('Error generatig token');

    let token = '';
    try {
      console.log(userProfile.toJSON());
      token = signAsync(userProfile.toJSON(), this.jwtSecret, {
        expiresIn: this.jwtExpiresIn,
      });
    } catch (e) {
      throw new HttpErrors.Unauthorized('error generating token ' + e);
    }

    return token;
  }

  async verifyToken(token: string): Promise<any> {
    if (!token) {
      throw new HttpErrors.Unauthorized(`Error verifyng token:'token' is null`);
    }
    let userProfile;
    try {
      const decryptedToken = await verifyAsync(token, this.jwtSecret);
      userProfile = Object.assign(
        {id: '', email: '', firstName: '', lastname: '', permission: []},
        {
          id: decryptedToken.id,
          email: decryptedToken.email,
          fistName: decryptedToken.firstName,
          lastname: decryptedToken.lastname,
          permission: decryptedToken.permission,
        },
      );
    } catch (e) {
      throw new HttpErrors.Unauthorized(`Error verifying token: ${e.message}`);
    }
    return userProfile;
  }
}
