/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { UtilsConfig } from '../utils/utilsconfig';
import { InternalServerErrorException } from '@nestjs/common';
import { Gateway, GatewayOptions } from 'fabric-network';
import { AppLogger } from '../logger/logger';
import * as appService from '../app.service';
import { ConfigContants } from '../utils/constants';
import { buildCCPOrg, buildWallet } from '../utils/AppUtil';
const controller = 'Invoke';
const logger = new AppLogger();

export async function invoke(username:string, method:string, args) {
    logger.log(`${new Date().toLocaleString()}: [${controller}] Start invoke new data.`);
    try {
        const utilsConfig = UtilsConfig.getInstance();
        const ccp = buildCCPOrg();
        // build an instance of the fabric ca services client based on
        // the information in the network configuration
        const caClient = utilsConfig.getCAClient(ccp, ConfigContants.ORG_CA_NAME);
        // setup the wallet to hold the credentials of the application user
        const wallet = await buildWallet(ConfigContants.WALLET_PATH);
        const gateway = new Gateway();
        let discoveryType = true;
        if(ConfigContants.DISCOVERY_AS_LOCALHOST.toString() === 'false') discoveryType = false;
        const gatewayOpts: GatewayOptions = {
            wallet,
            identity: username,
            discovery: { enabled: true, asLocalhost: discoveryType }, // using asLocalhost as this gateway is using a fabric network deployed locally
        };

        // setup the gateway instance
        // The user will now be able to create connections to the fabric network and be able to
        // submit transactions and query. All transactions submitted by this gateway will be
        // signed by this user using the credentials stored in the wallet.
        await gateway.connect(ccp, gatewayOpts);

        // Build a network instance based on the channel where the smart contract is deployed
        const network = await gateway.getNetwork(ConfigContants.CHANNEL_NAME);

        // Get the contract from the network.
        const contract = network.getContract(ConfigContants.CHAINCODE_NAME);
        let result:any= null;  
        switch(method){
        
            case 'createAcrisDataModel':
            result   = await contract.submitTransaction(method, args[0]);
            logger.log(`=====create result===",${result.toString()}`)
            break;
            case 'updateAcrisDataModel':
            result   = await contract.submitTransaction(method, args[0].trim(),args[1]);
            logger.log(`=====update result===",${result.toString()}`)
            break;

        }
        console.log('*** Result: committed');
        await gateway.disconnect();
        logger.log(`${new Date().toLocaleString()}: [${controller}] Invoke successful.`);
        return result.toString();
       
    } catch (error) {

        logger.error(`${new Date().toLocaleString()}: [${controller}] Failed to invoke transaction.`, error);
        console.error(`Failed to submit transaction: ${error}`);
        throw appService.buildAPIResponse(500, 'Failed to Register User', {}, error);
    }
}
