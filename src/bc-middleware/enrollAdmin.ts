/*
 * SPDX-License-Identifier: Apache-2.0
 */

import * as log4js from 'log4js';
import { InternalServerErrorException } from '@nestjs/common';
import { UtilsConfig } from '../utils/utilsconfig';
import { AppLogger } from '../logger/logger';
import  {ConfigContants} from '../utils/constants';
import { buildCCPOrg, buildWallet, prettyJSONString } from '../utils/AppUtil';
const controller = 'EnrollAdmin';
const logger = log4js.getLogger('enrollAdmin');
const Logger = new AppLogger();

export async function enrollAdmin() {

    Logger.log(`${new Date().toLocaleString()}: [${controller}] Start enroll admin.`);
    try {
        const utilsConfig = UtilsConfig.getInstance();
        const ccp = buildCCPOrg();

        // build an instance of the fabric ca services client based on
        // the information in the network configuration
        const caClient = utilsConfig.getCAClient(ccp,ConfigContants.ORG_CA_NAME);

        // setup the wallet to hold the credentials of the application user
        const wallet = await buildWallet(ConfigContants.WALLET_PATH);

        // in a real application this would be done on an administrative flow, and only once
        await utilsConfig.enrollAdmin(caClient, wallet,ConfigContants.ORG_MSP);
        // Check to see if we've already enrolled the admin user.
      
        Logger.log(`${new Date().toLocaleString()}: [${controller}] Successfully enrolled admin user "admin" and imported it into the wallet.`);
        Logger.log('Successfully enrolled admin user "admin" and imported it into the wallet');

    } catch (error) {
        Logger.error(`${new Date().toLocaleString()}: [${controller}] Failed to enroll admin user admin.`, error);
        console.error(`Failed to enroll admin user "admin": ${error}`);
        throw new InternalServerErrorException(`Failed to enroll admin user "admin": ${error}`);
    }
}

// enrollAdmin();
