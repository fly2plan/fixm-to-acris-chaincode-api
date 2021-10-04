import { Controller, Get, Post, Body,Request, HttpException, HttpStatus, UseGuards, Param, NotFoundException, HttpCode } from '@nestjs/common';
import { AppService } from '../app.service';
import { query } from '../bc-middleware/query';
import { ApiRequest } from '../models/api-request';
import { FixmDataRequest } from '../models/fixm-request';
import { ApiTags,  ApiResponse, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { AppLogger } from '../logger/logger';
import { UtilsConfig } from '../utils/utilsconfig';
import { invoke } from '../bc-middleware/invoke';
import { AcrisDataHistory, AcrisDataModel } from '../models/acris-flight-data';
import { Put } from '@nestjs/common';
import { TokenGuard } from 'src/gaurds/token.guard';


const controller = 'AppController';

@ApiTags('/api/v1/flightdata')
@Controller('/api/v1/flightdata')
@ApiBearerAuth()
@UseGuards(TokenGuard)
export class AppController {

    constructor(
        private readonly appService: AppService,
        private logger: AppLogger
    ) {
    }

   
    @Post('')
    @ApiOperation({summary: 'Create the acris flight data from the given fixm xml .',
                   description:'Fixm xml will be transformed and stored on the ledger .'})
    @ApiResponse({description: 'The flight has been successfully returned.', status: 200, type:  AcrisDataModel })
    async createFlightDataFromFixm(@Request() req: any,@Body() apiReq: FixmDataRequest) {
        console.log(apiReq,req.user)
        this.logger.log(`${new Date().toLocaleString()}: [${controller}] Initializing invoke function.`);
        const result  = await invoke(req.user,"createAcrisDataModel", [apiReq['fixm']]);
        const queryRes = await query(req.user, "readAcrisDataModel",result.toString().trim())
        return this.appService.buildAPIResponse(201, 'Invoke Successful!', queryRes, undefined);
    }
    
    @Put('/:flightKey')
    @ApiOperation({summary: 'Update an existing flight data on the network',
                   description:'Update the existing data if the key formed from the fixm after transformation'})
    @ApiParam({
                    description: 'Unique key for each flight. e.g. 2018-03-02T10:00:00.000ZEDDMLH462',
                    name: 'flightKey',
                    required: true,
                    type: 'string',
    })
    @ApiResponse({description: 'The flight has been successfully returned.', status: 200, type: AcrisDataModel })
    async updateFlightDataFromFixm(@Request() req: any,@Param('flightKey') flightKey,@Body() apiReq: FixmDataRequest) {
        console.log(apiReq)
        this.logger.log(`${new Date().toLocaleString()}: [${controller}] Initializing invoke function.`);
        console.log(apiReq['fixm'])
        await invoke(req.user,"updateAcrisDataModel", [flightKey,apiReq['fixm']]);
        const queryRes = await query(req.user, "readAcrisDataModel",flightKey);  
        return this.appService.buildAPIResponse(200, 'Invoke Successful!', queryRes, undefined);
    }

    
    
    @Get('/:flightKey')
    @ApiOperation({
        description: 'Returns the acris flight data stored from fixmt identified by key',
        summary: 'Get one acris record based on key .',
    })
    @ApiParam({
        description: 'Unique key for each flight. e.g. 2018-03-02T10:00:00.000ZEDDMLH462',
        name: 'flightKey',
        required: true,
        type: 'string',
    })
    @ApiResponse({description: 'The flight has been successfully returned.', status: 200, type:  AcrisDataModel })
    @ApiResponse({description: 'Not flight matching the given flightKey has been found.', status: 404,type: NotFoundException})
    public async getOneFlight(@Request() req: any,@Param('flightKey') flightKey) {
        console.log("=======user===========",req.user,flightKey);
       const queryRes = await query(req.user, "readAcrisDataModel",flightKey);  
       console.log("Data",queryRes) 
       return this.appService.buildAPIResponse(200, '', queryRes, undefined);

    }

    
    @Get('/:flightKey/history')
    @ApiOperation({
        description: 'Returns the history of udpates for the flight identified by flightKey',
        summary: 'Get acris data history',
    })
    @ApiParam({
        description: 'Unique key for each flight. e.g. 2018-03-02T10:00:00.000ZEDDMLH462',
        name: 'flightKey',
        required: true,
        type: 'string',
    })
    @ApiResponse({description: 'The flight has been successfully returned.', isArray: true,
    status: 200, type: AcrisDataHistory})
    @ApiResponse({description: 'Not flight matching the given flightKey has been found.', status: 404})
    public async getFlightHistory(@Request() req: any,
        @Param('flightKey') flightKey){
            const queryRes = await query(req.user, "getFlightHistory",flightKey);  
            return queryRes;
    }

    @Post('/query')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        description: 'Return data based on the couchdb query supllied.',
        summary: 'Search  the ledger using custome  couchdb query.',
    })
    async query(@Request() req: any,@Body() apiReq: ApiRequest) {
        this.logger.log(`${new Date().toLocaleString()}: [${controller}] Initializing query function.`);
        let queryRes: any = {};
        if (typeof apiReq.args === 'string') {
            queryRes = await query(req.user, apiReq.method, apiReq.args);
        } else {
            queryRes = await query(req.user, apiReq.method, JSON.stringify(apiReq.args));
        }
        return this.appService.buildAPIResponse(200, '', queryRes, undefined);
    }


    @Post('/find')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({description: 'The list of data have been successfully returned.', isArray: true,
    status: 200})
    @ApiResponse({status: 404, description: 'No data matching the query has been found.'})
    @ApiOperation({
        description: 'Returns the data based on the cutsome query.',
        summary: 'Get the data based on custome query.',
    })
    public async getFlightListWithQuery(@Request() req: any, @Body() query: any) {
        const queryRes = await query(req.user, "getFlightQuery",JSON.stringify(query));  
        return queryRes;
    }

    @Post('queryByTxnId')
    @ApiOperation({
        description: 'Returns the data for the given trransaction id.',
        summary: 'Get acris data.',
    })
    async queryByTxnId(@Request() req: any,@Body() apiReq: ApiRequest) {
        const utilsConfig = UtilsConfig.getInstance();
        const queryLedger = {
            "selector": {
               "txId": apiReq.args['txID']
            }
         }
         const queryRes = await query(req.user, "getFlightQuery",JSON.stringify(queryLedger)); 
        console.log("result",queryRes);
        return queryRes;
    }

}
