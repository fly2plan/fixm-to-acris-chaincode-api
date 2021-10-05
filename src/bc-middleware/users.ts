
import { UtilsConfig } from '../utils/utilsconfig';
import {ConfigContants} from '../utils/constants';
import { buildCCPOrg, buildWallet, prettyJSONString } from '../utils/AppUtil';
import { AppLogger } from '../logger/logger';
import * as appService from '../app.service';
const controller = 'User';
const Logger = new AppLogger();

export async function registerUser(userName:string, orgType:string, iataCode: string, password: string) {

    Logger.log(`${new Date().toLocaleString()}: [${controller}] Start registering user.`);
    console.log("=====OrgType====",orgType,iataCode, password)
    try {
        const utilsConfig = UtilsConfig.getInstance();
        const ccp = buildCCPOrg();
        // build an instance of the fabric ca services client based on
        // the information in the network configuration
        const caClient = utilsConfig.getCAClient(ccp,ConfigContants.ORG_CA_NAME);
        // setup the wallet to hold the credentials of the application user
        const wallet = await buildWallet(ConfigContants.WALLET_PATH);
              
        await utilsConfig.registerAndEnrollUser(caClient, wallet,ConfigContants.ORG_MSP,userName,ConfigContants.ORG_DPT_AFFILIATION , orgType, iataCode,password);

        Logger.log(`${new Date().toLocaleString()}: [${controller}] Successfully registered user.`);
    } catch (error) {
        Logger.error(`${new Date().toLocaleString()}: [${controller}] Failed to register user.`, error);
        console.error(`Failed to register user ${userName}: ${error}`);
        // throw new InternalServerErrorException(error);
        throw appService.buildAPIResponse(500, 'Failed to Register User', {}, error);

    }
}
