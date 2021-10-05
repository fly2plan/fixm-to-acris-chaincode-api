import { Controller, Get, Response,Post, Body, HttpException, HttpStatus, UseGuards, Param, NotFoundException } from '@nestjs/common';
import { AppService } from '../app.service';
import { enrollAdmin } from '../bc-middleware/enrollAdmin';
import { ApiRequest } from '../models/api-request';
import { LoginUser } from '../models/login-user-data';
import { RolesGuard } from '../gaurds/roles.guard';
import { ApiTags, ApiBasicAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { AppLogger } from '../logger/logger';
import { UtilsConfig } from '../utils/utilsconfig';
import { registerUser } from '../bc-middleware/users';
import  { loginUser }  from '../bc-middleware/login';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken' ;
import {ConfigContants} from '../utils/constants';

const controller = 'UserController';

@ApiTags('UserAPI')
@Controller('/user')
export class UserController {

    constructor(
        private readonly appService: AppService,
        private logger: AppLogger,
        private readonly jwtService: JwtService,
    ) {

    }
    @ApiOperation({
        description: 'Check instance is up and running.',
        summary: 'Test the instance state .',
    })
    @Get('up')
    async getUp(): Promise<any> {
        this.logger.log(`${new Date().toLocaleString()}: [${controller}] Initializing check application health function.`);
        return this.appService.buildAPIResponse(200, 'App running!', {}, undefined);
    }


    @Get('/health')
    @ApiOperation({
        description: 'Returns the instance status',
        summary: 'Get the instance state .',
    })
    async getHealth(): Promise<any> {
        this.logger.log(`${new Date().toLocaleString()}: [${controller}] Initializing check application health function.`);
        return this.appService.buildAPIResponse(200, 'App running!', {}, undefined);
    }
    
    @ApiOperation({
        description: 'Enroll the admin',
        summary: 'Enroll application admin .',
    })
    @Get('/enrollAdmin')
    @ApiBasicAuth()
    @UseGuards(RolesGuard)
    async enrollAdmin() {
        this.logger.log(`${new Date().toLocaleString()}: [${controller}] Initializing enroll admin function.`);
        await enrollAdmin();
        this.logger.log(`${new Date().toLocaleString()}: [${controller}] Start Hello`);
        return this.appService.buildAPIResponse(200, 'admin Registered Successfully!', {}, undefined);
    }

    @ApiOperation({
        description: 'Register a new user by giving username and password..',
        summary: 'Register a new user. Eg . { "methode":"register",args : {"userName":"renjith","password":"renjith123","orgtype":"airline","iatacode":"BA"}}',
    })
    @Post('/registerUser')
    @ApiBasicAuth()
    @UseGuards(RolesGuard)
    async registerUser(@Body() apiReq: ApiRequest) {
        this.logger.log(`${new Date().toLocaleString()}: [${controller}] Initializing register user function.${apiReq}`);
       console.log(apiReq,);
       if (!apiReq || !apiReq.args || !apiReq.args['userName']) {
            throw new HttpException('userName field missing in the Request', HttpStatus.BAD_REQUEST);
        }
       await registerUser(apiReq.args['userName'], apiReq.args['orgtype'] , apiReq.args['iatacode'], apiReq.args['password']);
       return this.appService.buildAPIResponse(200, 'User Registered Successfullyl!', {}, undefined);
    }
    @ApiOperation({
        description: 'Login and get the JWT token.',
        summary: 'Get the JWT token.',
    })
    @Post('/login')
    async loginUser(@Response() res: any,@Body() apiReq: LoginUser) {
        this.logger.log(`${new Date().toLocaleString()}: [${controller}] Initializing register user function.${apiReq}`);
   
       if (!apiReq.userName || apiReq.userName.trim().length < 0) {
            throw new HttpException('userName field missing in the Request', HttpStatus.BAD_REQUEST);
        }
      if (!apiReq.password || apiReq.password.trim().length < 0) {
            throw new HttpException('password field missing in the Request', HttpStatus.BAD_REQUEST);
       }
       let isVlaidUser = await loginUser(apiReq.userName, apiReq.password);
       this.jwtService.decode
       if(isVlaidUser){
        return res
        .status(HttpStatus.OK)
        .json({jwt: jwt.sign({
            _id: apiReq.userName           
          },ConfigContants.JWT_SECRET ,{'expiresIn':'30d'}),
          status: 200,
          username: apiReq.userName,
        });
    }

       
    return res
      .status(HttpStatus.FORBIDDEN)
      .json({ status: 403, message: 'Username or password wrong!' });
    }


    

}
