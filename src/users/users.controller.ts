import { Body, Controller, Get, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { CreateUsersDto } from './dto/create-users.dto';
// import { Users } from './schema/users.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  async findAll() {
    try {
      const users = await this.usersService.findAll();
      return {
        "message": [
          "Success"
        ],
        "data": users,
        "statusCode": 200
      }
    } catch (error) {
      console.log(error)
      return {
        "message": [
          error.message ? error.message : error,
        ],
        "error": 'Bad Request',
        "statusCode": 400
      }
    }
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(@UploadedFile() image: Express.Multer.File, @Body() createUsersDto: CreateUsersDto) {
    try {
      const createdUsers = await this.usersService.create(image, createUsersDto);
      console.log(createdUsers)
      return {
        "message": [
          "Success"
        ],
        "data": createdUsers,
        "statusCode": 201
      }

    } catch (error) {
      console.log(error)
      return {
        "message": [
          error.code === 11000 ? "user already exists" : error.message ? error.message : error,
        ],
        "error": 'Bad Request',
        "statusCode": 400
      }
    }
  }
}
