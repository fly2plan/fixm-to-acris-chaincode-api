
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import  { loginUser }  from './bc-middleware/login';
import {ConfigContants} from './utils/constants';
import  { User }  from './models/user';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,"jwt") {
  constructor() {
    super(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: ConfigContants.JWT_SECRET,
      });
  }

  public async validate(payload:any): Promise<User> {
    console.log('payload', payload);
    const isVlaid = await loginUser(payload.id,"");
    console.log("====================isvalid in passport========",isVlaid);
    if (!isVlaid) {
      // this one
      throw new UnauthorizedException();
    }
    return new User(payload.id,"ret");
  }
}
