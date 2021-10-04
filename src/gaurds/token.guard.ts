import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {ConfigContants} from '../utils/constants';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(private readonly reflector: Reflector,private readonly jwtService: JwtService,) {}

  canActivate(context: ExecutionContext): boolean {

    const request = context.switchToHttp().getRequest();

    if (request.headers.authorization) {

        let authentication = request.headers.authorization.replace(/^Basic/, '');      
        authentication = authentication.replace(/^Bearer/, '');
        console.log("====================================",authentication);
        try{
        let decoded  = jwt.verify(authentication.trim(),ConfigContants.JWT_SECRET);
        request.user = decoded["_id"];
        }catch(error){
          console.log("Error in decding the token",error);
          throw new UnauthorizedException();

        }
        return true;
  
      }
console.log("======false=======")
    return false;
}
}
