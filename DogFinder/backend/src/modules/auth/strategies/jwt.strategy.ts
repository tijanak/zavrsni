import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { IUser } from '@dog-finder/models';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service';
import { jwtConstants } from '../constants';
const ExtractJwtFromCookie = (cookieName: string) => {
  return (req: Request) => {
    const token = req.cookies[cookieName];
    return token || ExtractJwt.fromAuthHeaderAsBearerToken()(req);
  };
};
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwtFromCookie('accessToken'),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }
  async validate(payload: any): Promise<IUser | null> {
    const authUser = await this.userService.findOne(payload.username);
    if (!authUser) {
      throw new UnauthorizedException('Nevalidan token');
    }
    return authUser;
  }
}
