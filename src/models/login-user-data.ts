import { ApiProperty } from "@nestjs/swagger";
export class LoginUser {
    

  @ApiProperty({"description":"Username of the user"})
  public userName: string;

  @ApiProperty({"description":"Password of the user"})
  public  password: string;

   
  }
