import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as config from '../../config/config';
import {ConfigContants} from '../utils/constants';
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {

    const request = context.switchToHttp().getRequest();

    if (request.headers.authorization) {
        let authentication = request.headers.authorization.replace(/^Basic/, '');
        authentication = ( Buffer.from(authentication, 'base64')).toString('utf8');
        const loginInfo = authentication.split(':');
        console.log("Values:",loginInfo[0] , ConfigContants.APP_ADMIN_USER_NAME,loginInfo[1] ,ConfigContants.APP_ADMIN_USER_PASSWORD)
        if (loginInfo[0].toString().trim() === ConfigContants.APP_ADMIN_USER_NAME.toString() && loginInfo[1].trim() === ConfigContants.APP_ADMIN_USER_PASSWORD) {
            return true;
        }
    }
console.log("======false=======")
    return false;
  }
}
