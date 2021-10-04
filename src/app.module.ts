import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './app.service';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './shared/logging.interceptor';
import { HttpErrorFilter } from './shared/http-error.filter';
import { AppLogger } from './logger/logger';
//import { ConfigModule } from 'nestjs-config';
import * as config from '../config/config';
import { UserController } from './controllers/user.controller';
import { User } from 'fabric-common';

import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import {ConfigContants} from './utils/constants';
import { JwtStrategy } from './jwt.strategy';
@Module({
    imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: async () => ({
        secretOrPrivateKey: ConfigContants.JWT_SECRET,
        signOptions: {
          expiresIn: 36000,
        },
      }),
    }),
    
      
    ],
    controllers: [AppController,UserController],
    providers: [
        AppService,
        
        AppLogger,
        {
            provide: APP_FILTER,
            useClass: HttpErrorFilter,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: LoggingInterceptor,
        },
    ],
})
export class AppModule {}
