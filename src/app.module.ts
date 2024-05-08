import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { PostModule } from './post/post.module';

@Module({
  imports: [
    // connect to mongodb database
    MongooseModule.forRoot('mongodb://localhost:27017/nest-SMP'),
    // connect to cloudinary storage using Multer module
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const timestamp = Date.now();
          callback(null, `${timestamp}-${file.originalname}`);
        },
      }),
    }),
    UsersModule,
    PostModule,
  ],
})
export class AppModule {}
