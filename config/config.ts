import * as dev from './dev/config.json';
import * as local from './local/config.json';
import * as prod from './prod/config.json';
import * as fs from 'fs';
import * as path from 'path';

export function getEnv() {
    if (process.env.NODE_ENV === 'DEV') {
        return dev;
    }

    if (process.env.NODE_ENV === 'PROD') {
        return prod;
    }

    
     return local;


}

export function getServerEnv() {
    if (process.env.NODE_ENV === 'DEV') {
        return 'dev';
    }

    if (process.env.NODE_ENV === 'PROD') {
        return 'prod';
    }

    
     return 'local';


}


export function getLogPath() {

    if(process.env.LOG_PATH)  {

        if(!fs.existsSync(process.env.LOG_PATH)) fs.mkdirSync(process.env.LOG_PATH);

        return process.env.LOG_PATH;

    } 
    const log_name = path.join(process.cwd(),  "/app_log");
    if(!fs.existsSync(log_name)) fs.mkdirSync(log_name); 

    return log_name;

}

export function getEnvPath() {
    const env =   getServerEnv();
    return './config/' + env + '/config.json';
}

export function getNetworkPath() {
    if(process.env.NETWORK_PATH)    return process.env.NETWORK_PATH;
    const env =   getServerEnv();
    return './config/' + env + '/connection-org1.json';
}
