import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './schema/post.schema';
import { Model, Types } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private readonly PostModel: Model<Post>,
  ) {}

  async create(
    image: Express.Multer.File,
    createPostDto: CreatePostDto,
  ): Promise<Post> {
    // Validate the image file
    // if (!image) {
    //   throw new BadRequestException('Image file is required');
    // }

    const createdPost = await this.PostModel.create({
      title: createPostDto.title,
      description: createPostDto.description,
      slug: createPostDto.slug,
      user: new Types.ObjectId(createPostDto.user),
      image: image?.path ? image.path : null,
    });

    return createdPost;
  }

  async findAll(): Promise<Post[]> {
    const posts = await this.PostModel.find()
      .populate({
        path: 'user',
        select: 'name email',
        // match: { name: 'yash' }, // Example condition for the user
      })
      .exec(); // Exclude posts where user does not match;
    return posts;
  }
}
