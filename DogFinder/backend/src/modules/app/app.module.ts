import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from '../image/image.entity';
import { User } from '../user/user.entity';
import { Post } from '../post/post.entity';
import { PostModule } from '../post/post.module';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { ImageModule } from '../image/image.module';
import { DogNNModule } from '../dognn/dognn.module';


@Module({
  imports: [
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.NX_POSTGRES_HOST,
      port: +process.env.NX_POSTGRES_PORT,
      username: process.env.NX_POSTGRES_USER,
      password: process.env.NX_POSTGRES_PASSWORD,
      database: process.env.NX_POSTGRES_DB,
      entities: [User, Image, Post],
      synchronize: true,
    }),
    PostModule,
    UserModule,
    AuthModule,
    ImageModule,
    DogNNModule
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService],
})
export class AppModule {}
