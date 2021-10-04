import * as path from 'path';
export class ConfigContants{

    public static  CA_ADMIN_USERID       = process.env.CA_ADMIN_USERID   || 'admin';
    public static  CA_ADMIN_PASSWORD     = process.env.CA_ADMIN_PASSWORD || 'adminpw';
    public static  ORG_MSP               = process.env.ORG_MSP || 'Org1MSP';
    public static  ORG_CA_NAME           = process.env.ORG_CA_NAME       || 'ca.org1.example.com';
    public static  WALLET_PATH           = process.env.WALLET_PATH || path.join(process.cwd(),  'wallet');
    public static  ORG_DPT_AFFILIATION   = process.env.ORG_DPT_AFFILIATION || 'org1.department1' ;
    public static  CHANNEL_NAME          = process.env.CHANNEL_NAME || 'mychannel' ;
    public static  CHAINCODE_NAME        = process.env.CHAINCODE_NAME || 'fixmtoacriscontract' ;
    public static  DISCOVERY_AS_LOCALHOST =  process.env.DISCOVERY_AS_LOCALHOST || true;
    public static  JWT_SECRET            =  process.env.JWT_SECRET || "ibssecret";
    public static  SERVER_PORT           =  process.env.SERVER_PORT || "3000";


    public static  APP_ADMIN_USER_NAME       =  process.env.APP_ADMIN_USER_NAME || "admin";
    public static  APP_ADMIN_USER_PASSWORD   =  process.env.APP_ADMIN_USER_PASSWORD || "adminpw";


}