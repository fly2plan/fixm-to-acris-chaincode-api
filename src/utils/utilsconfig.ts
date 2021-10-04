import * as log4js from 'log4js';
import * as config from '../../config/config';
const logger = log4js.getLogger('RegisterUsers');
import { Gateway, GatewayOptions } from 'fabric-network';
import * as FabricCAServices from 'fabric-ca-client';
import { Wallet } from 'fabric-network';
import { InternalServerErrorException } from '@nestjs/common';
import  {ConfigContants} from './constants';
import { User } from 'fabric-common';
 
export class UtilsConfig {

    private static instance: UtilsConfig;

    /**
     * The Singleton's constructor should always be private to prevent direct
     * construction calls with the `new` operator.
     */
    private constructor() { }

    /**
     * The static method that controls the access to the singleton instance.
     *
     * This implementation let you subclass the Singleton class while keeping
     * just one instance of each subclass around.
     */
    public static getInstance(): UtilsConfig {
        if (!UtilsConfig.instance) {
            UtilsConfig.instance = new UtilsConfig();
        }

        return UtilsConfig.instance;
    }

    // Create a new CA client for interacting with the CA.
   public getCAClient(ccp: Record<string, any>, caHostName: string): FabricCAServices {
        console.log('============ START getCAClient for org============');
        const caInfo = ccp.certificateAuthorities[caHostName]; // lookup CA details from config
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        const caClient = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);
        console.log(`Built a CA Client named ${caInfo.caName}`);
        console.log('============ END getCAClient for org==============');
        return caClient;
    };


/*
*Description: Function to enroll admin user.
*@param caClient :calient FabricService instance.
*@param wallet:  wallet where admin credential stored.
*@orgMspId : mspid of the user organization.
*/
public async enrollAdmin(caClient: FabricCAServices, wallet: Wallet, orgMspId: string): Promise<void>{
    try {

        console.log('============ START enrollAdmin for org============');
        // Check to see if we've already enrolled the admin user.
        const identity = await wallet.get(ConfigContants.CA_ADMIN_USERID);
        if (identity) {
            console.log('An identity for the admin user already exists in the wallet');
            throw new InternalServerErrorException(`An identity for the admin user already exists in the wallet": ${orgMspId}`);
   
        }

        // Enroll the admin user, and import the new identity into the wallet.
        const enrollment = await caClient.enroll({ enrollmentID: ConfigContants.CA_ADMIN_USERID, enrollmentSecret: ConfigContants.CA_ADMIN_PASSWORD });
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: orgMspId,
            type: 'X.509',
        };
        await wallet.put(ConfigContants.CA_ADMIN_USERID, x509Identity);
        console.log('Successfully enrolled admin user and imported it into the wallet');
    } catch (error) {
        console.error(`Failed to enroll admin user : ${error}`);
        throw new InternalServerErrorException(`Failed to Register  admin": ${error}`);
   
    }

    console.log('============ END enrollAdmin for org============');
};



/*
*Description: Function to enroll client user.
*@param caClient :FabricService instance.
*@param wallet:  wallet where admin credential stored.
*@orgMspId : mspid of the user organization.
*@uerId: id of the user.
*@affilation: affilation of the user department.
*@return : boolean .if user enrolled correctly , true.
*/
public async registerAndEnrollUser (caClient: FabricCAServices, wallet: Wallet, orgMspId: string, userId: string, affiliation: string,orgType: string ,iataCode: string ): Promise<string>  {
    try {

        console.log('============ START registerAndEnrollUser for org============');
        // Check to see if we've already enrolled the user
        const userIdentity = await wallet.get(userId);
        if (userIdentity) {
            throw new InternalServerErrorException(`An identity for the user ${userId} already exists in the wallet`);
        }

        // Must use an admin to register a new user
        const adminIdentity = await wallet.get(ConfigContants.CA_ADMIN_USERID);
        if (!adminIdentity) {
            console.log('An identity for the admin user does not exist in the wallet');
            console.log('Enroll the admin user before retrying');
            return 'Admin identity does not exits.Enroll the admin user before retrying!.';
        }

        // build a user object for authenticating with the CA
        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, ConfigContants.CA_ADMIN_USERID);

        // Register the user, enroll the user, and import the new identity into the wallet.
        // if affiliation is specified by client, the affiliation value must be configured in CA
        const secret = await caClient.register({
            affiliation,
            enrollmentID: userId,
            role: 'client',attrs: [{ name: 'orgtype', value: orgType, ecert: true },{ name: 'iatacode', value: iataCode, ecert: true }]
        }, adminUser);
        const enrollment = await caClient.enroll({
            enrollmentID: userId,
            enrollmentSecret: secret,
        });
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: orgMspId,
            type: 'X.509',
        };
        await wallet.put(userId, x509Identity);
        console.log('============ END registerAndEnrollUser for org============');
        return `Successfully registered and enrolled user ${userId} and imported it into the wallet`;
    } catch (error) {
      
        throw new InternalServerErrorException(`Failed to register user : ${error}`);
    }
};








/*
*Description: Function to enroll client user.
*@param caClient :FabricService instance.
*@param wallet:  wallet where admin credential stored.
*@orgMspId : mspid of the user organization.
*@uerId: id of the user.
*@affilation: affilation of the user department.
*@return : boolean .if user enrolled correctly , true.
*/
public async isUserExits (caClient: FabricCAServices, wallet: Wallet, userId: string): Promise<boolean>  {
    try {

        console.log('============ START isUserExits for ============',userId);
        // Check to see if we've already enrolled the user
        const userIdentity = await wallet.get(userId.trim());
console.log("is user exits",userIdentity)
        if (userIdentity) {
           
            
           

            return true;

            
        }else{

            return false;
        }

       
    } catch (error) {
      
        throw new InternalServerErrorException(`Failed to register user : ${error}`);
    }
};





}
