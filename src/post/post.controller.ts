import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @UploadedFile() image: Express.Multer.File,
    @Body() createPostDto: CreatePostDto,
  ) {
    try {
      const createdPost = await this.postService.create(image, createPostDto);

      return {
        message: ['Success'],
        data: createdPost,
        statusCode: 201,
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

  @Get()
  async findAll() {
    try {
      const posts = await this.postService.findAll();
      return {
        message: ['Success'],
        data: posts,
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
