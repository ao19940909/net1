import {
  Body,
  Controller,
  Get,
  Post,
  UseInterceptors,
  UploadedFile,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { CreateUsersDto } from './dto/create-users.dto';
import { UpdateUsersDto, ParamsIdDto } from './dto/update-users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Get all users route to user service
  @Get()
  async findAll() {
    try {
      // call user service to get all users
      const users = await this.usersService.findAll();
      return {
        message: ['Success'],
        data: users,
        statusCode: 200,
      };
    } catch (error) {
      console.log(error);
      return {
        message: [error.message ? error.message : error],
        error: 'Bad Request',
        statusCode: 400,
      };
    }
  }

  // Create user route to user service
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @UploadedFile() image: Express.Multer.File,
    @Body() createUsersDto: CreateUsersDto,
  ) {
    try {
      // call user service to create user
      const createdUsers = await this.usersService.create(
        image,
        createUsersDto,
      );

      return {
        message: ['Success'],
        data: createdUsers,
        statusCode: 201,
      };
    } catch (error) {
      console.log(error);
      return {
        message: [
          error.code === 11000
            ? 'user already exists'
            : error.message
              ? error.message
              : error,
        ],
        error: 'Bad Request',
        statusCode: 400,
      };
    }
  }

  @Post(':id')
  async update(
    @Body() updateUsersDto: UpdateUsersDto,
    @Param() params: ParamsIdDto,
  ) {
    try {
      // call user service to update user
      const updatedUsers = await this.usersService.update(
        updateUsersDto,
        params,
      );
      return {
        message: ['Success'],
        data: updatedUsers,
        statusCode: 200,
      };
    } catch (error) {
      console.log(error);
      return {
        message: [error.message ? error.message : error],
        error: 'Bad Request',
        statusCode: 400,
      };
    }
  }
}
