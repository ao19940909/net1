import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";


export class CreateUsersDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  // @IsNumber()
  age: number;

  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;

}