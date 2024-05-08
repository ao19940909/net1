import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUsersDto {
  name: string;
  password: string;
  age: number;

  @IsOptional()
  @IsEmail()
  email: string;
}

export class ParamsIdDto {
  @IsNotEmpty()
  id: string;
}
