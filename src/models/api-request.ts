import { ApiProperty } from '@nestjs/swagger';


export class ApiRequest {
    // @ApiProperty()
    // chaincode: string;

    @ApiProperty( {"description":"chaincode methode to invoke"})
    method: string;

    @ApiProperty({"description":"chaincode arguments:eg args :{\"ab\":1,\"bc\":2}"})
    args: object;

    // @ApiProperty()
    // channel:string
  }
