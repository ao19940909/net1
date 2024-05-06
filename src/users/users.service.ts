import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUsersDto } from './dto/create-users.dto';
import { Model } from 'mongoose';
import { Users } from './schema/users.schema';
import * as fs from 'fs';
import { Readable } from 'stream';
import 'dotenv/config'
import { UploadApiResponse } from 'cloudinary';

import { v2 as cloudinary } from 'cloudinary';
import { url } from 'inspector';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

@Injectable()
export class UsersService {

  constructor(@InjectModel(Users.name) private readonly UsersModel: Model<Users>) { }

  async findAll() {
    const users = await this.UsersModel.find();
    return users
  }

  async create(image: Express.Multer.File, createUsersDto: CreateUsersDto): Promise<Users> {
    if (!image) {
      throw new BadRequestException('Image file is required');
    }
    console.log(createUsersDto)
    const filename = createUsersDto.email.split('@')[0]
      + '_'
      + Date.now()
      + '.'
      + image.originalname.split('.')[1];

    const imagePath = `./uploads/${filename}`;
    // Create a readable stream from the buffer
    const bufferStream = new Readable();
    bufferStream.push(image.buffer);
    bufferStream.push(null); // Signal the end of the stream

    // Upload the stream to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'uploads', public_id: filename.split('.')[0] },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      bufferStream.pipe(uploadStream);
    });
    console.log(result, 'resul')

    const createdUsers = await this.UsersModel.create({
      ...createUsersDto,
      profileImage: (result as UploadApiResponse).secure_url
    });
    return createdUsers;
  }
}
