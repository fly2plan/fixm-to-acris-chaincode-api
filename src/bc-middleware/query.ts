/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { UtilsConfig } from '../utils/utilsconfig';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Gateway, GatewayOptions } from 'fabric-network';
import { AppLogger } from '../logger/logger';
import { ConfigContants } from '../utils/constants';
import { buildCCPOrg, buildWallet } from '../utils/AppUtil';

const controller = 'Query';
const logger = new AppLogger();

export async function query(username, methodName, args) {
    logger.log(`${new Date().toLocaleString()}: [${controller}] Start query data.`);
    try {
        const utilsConfig = UtilsConfig.getInstance();
        const ccp = buildCCPOrg();
        // build an instance of the fabric ca services client based on
        // the information in the network configuration
        const caClient = utilsConfig.getCAClient(ccp, ConfigContants.ORG_CA_NAME);
        // setup the wallet to hold the credentials of the application user
        const wallet = await buildWallet(ConfigContants.WALLET_PATH);
        const gateway = new Gateway();
        const gatewayOpts: GatewayOptions = {
            wallet,
            identity: username,
            discovery: { enabled: true, asLocalhost: (ConfigContants.DISCOVERY_AS_LOCALHOST.toString() === 'true' ? true : false) }, // using asLocalhost as this gateway is using a fabric network deployed locally
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
        console.log("args",args)

        const result = await contract.evaluateTransaction(methodName, args);
        logger.log(`${new Date().toLocaleString()}: [${controller}] Query data successfully.`);
        return result.toString() === '' ? [] : JSON.parse(result.toString());
    } catch (error) {
        logger.error(`${new Date().toLocaleString()}: [${controller}] Failed to query transaction.`, error);
        console.error(`Failed to evaluate transaction: ${error}`);
        if(error.toString().indexOf('does not exist') > 0) throw new NotFoundException();
        throw new InternalServerErrorException(`Failed to evaluate transaction: ${error}`);
    }
}

// main();
