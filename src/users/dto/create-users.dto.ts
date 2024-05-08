import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUsersDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  // @IsNumber()
  @IsNotEmpty()
  age: number;

  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;
}
