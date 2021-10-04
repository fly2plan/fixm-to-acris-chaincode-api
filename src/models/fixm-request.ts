import { ApiProperty } from "@nestjs/swagger";
export class FixmDataRequest {
    // @ApiProperty()
    // chaincode: string;

    

    @ApiProperty({"description":"The FIXM xml data",})
    public fixm: string;

    // @ApiProperty()
    // channel:string
  }
