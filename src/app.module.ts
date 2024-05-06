import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/nest-SMP'),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const timestamp = Date.now();
          callback(null, `${timestamp}-${file.originalname}`);
        },
      }),
    }), UsersModule],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule { }
