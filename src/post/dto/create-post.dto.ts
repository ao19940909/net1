import { IsEmail, IsNotEmpty, IsObject, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  slug: string;

  @IsNotEmpty()
  user: string;
}
