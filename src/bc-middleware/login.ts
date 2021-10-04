
import { UtilsConfig } from '../utils/utilsconfig';
import {ConfigContants} from '../utils/constants';
import { buildCCPOrg, buildWallet, prettyJSONString } from '../utils/AppUtil';
import { AppLogger } from '../logger/logger';
import * as appService from '../app.service';
import { JwtService } from '@nestjs/jwt';
const controller = 'LoginUser';
const Logger = new AppLogger();

export async function loginUser(userName:string, password:string) {

    Logger.log(`${new Date().toLocaleString()}: [${controller}] Start login user.`);
    try {

        const utilsConfig = UtilsConfig.getInstance();
        const ccp         = buildCCPOrg();
        // build an instance of the fabric ca services client based on
        // the information in the network configuration
        const caClient    = utilsConfig.getCAClient(ccp,ConfigContants.ORG_CA_NAME);
        // setup the wallet to hold the credentials of the application user
        const wallet      = await buildWallet(ConfigContants.WALLET_PATH);
          
        let isValidUser   = await utilsConfig.isUserExits(caClient, wallet,userName);
        return isValidUser;
        Logger.log(`${new Date().toLocaleString()}: [${controller}] Successfully finished login check.`);
    } catch (error) {
        Logger.error(`${new Date().toLocaleString()}: [${controller}] Failed to authenticate user.`, error);
        console.error(`Failed to authenticate user ${userName}: ${error}`);
        // throw new InternalServerErrorException(error);
        throw appService.buildAPIResponse(500, 'Failed to Authenticate User', {}, error);

    }
}
