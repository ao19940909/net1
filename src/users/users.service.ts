import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUsersDto } from './dto/create-users.dto';
import { Model } from 'mongoose';
import { Users } from './schema/users.schema';
import { Readable } from 'stream';
import 'dotenv/config';
import { UploadApiResponse } from 'cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import { UpdateUsersDto, ParamsIdDto } from './dto/update-users.dto';
import { Post } from 'src/post/schema/post.schema';

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private readonly UsersModel: Model<Users>,
  ) {}

  // Get all users from database
  async findAll() {
    const users = await this.UsersModel.findById('6638c57a304df6709fa376d1')
      .populate('posts')
      .exec();
    return users;
  }

  // Create a new user in the database
  async create(
    image: Express.Multer.File,
    createUsersDto: CreateUsersDto,
  ): Promise<Users> {
    // Validate the image file
    if (!image) {
      throw new BadRequestException('Image file is required');
    }

    // Generate a unique filename
    const filename =
      createUsersDto.email.split('@')[0] +
      '_' +
      Date.now() +
      '.' +
      image.originalname.split('.')[1];

    // Create a readable stream from the buffer
    const bufferStream = new Readable();
    bufferStream.push(image.buffer);
    bufferStream.push(null); // Signal the end of the stream

    // Upload the image to Cloudinary and get the result
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'uploads',
          public_id: filename.split('.')[0],
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        },
      );

      bufferStream.pipe(uploadStream);
    });

    // Create the user
    const createdUsers = await this.UsersModel.create({
      ...createUsersDto,
      profileImage: (result as UploadApiResponse).secure_url,
    });
    return createdUsers;
  }

  async update(
    updateUsersDto: UpdateUsersDto,
    params: ParamsIdDto,
  ): Promise<Users> {
    const updatedUsers = await this.UsersModel.findByIdAndUpdate(
      params.id,
      updateUsersDto,
      { new: true },
    );
    return updatedUsers;
  }
}
