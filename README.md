# api-middleware for fixmtoacristransformer chaincode.

The middleware to support chaincode operations on the fixtoacris transformer. 
## Features of the Client SDK!
The Client SDK is written with Typescript offered by Nest.js which makes it easy to plugin lots of predefined functionalities.
Like the ones mentioned Below.
For more details about [Nest.js](https://nestjs.com/)
the paths of all the certificates__ 



###### Setup NODE_ENV

The client chooses the config folder based on the NODE_ENV variable set on the running host

```bash
export NODE_ENV="LOCAL"
```
The possible values for the env variable is `LOCAL`,`DEV`,`PROD` all case sensitive.

###### Running the App

The Client requires Node 10.9 - 10.xx version as per the Hyperledger requirement

- Set the node version to 8.x using NVM if needed
- `npm install`
- `npm run start` for local
- `npm run build` for prod & run `node dist/src/main.js`
- Use pm2 process management for production version.

go to http://localhost:3000/api-docs on your browser to access the swagger documentation

- __After running the app, the first step is to run the enrollAdmin API to further use other URLS__
-  Unlock the APIs in the swagger with Authorise button on the top right corner
 and enter 
 __
 username : admin
 password : adminpw
__
- Run enrollAdmin either from Swagger or run the curl command below

```
curl -X GET "http://localhost:3000/enrollAdmin" -H "accept: */*" -H "Authorization: Basic YWRtaW46YWRtaW5wdw=="
```

## Standard Request Response & Error format

###### Request Format

Note : the method name in the request corresponds to the chaincode Method Name:

- __Register User API:__
URL: http://localhost:3000/registerUser

    ```javascript
    {
        "method": "registerUser", 
        "Args":{
            "userName": "00000"
        }
    }
    ```


- __Invoke API__
URL: http://localhost:3000/invoke

    ```javascript
    {
        "method": "putData", 
        "Args":{
            "id": "0"
            "value": "ABC"
        }
    }
    ```

    ```

- __Sample Response__

    ```javascript
    {
        "statusCode": 200,
        "message": "Invoke Successful!", "data":
        "61a9fc1728617da8bcc8a0449fe9ffebc5e25c912bafcf36b0bc100b6cffea8b", "error": {}
    }
    ```


- __Sample Error__

    ```javascript
    {
        "code": 500,
        "timestamp": "2020-1-28",
        "path": "/invoke?=",
        "method": "POST",
        "message": "No valid responses from any peers. 1 peer error responses:\n
        peer=peer1, status=500, message=The key does not exist. Please check." 
    }
    ```
