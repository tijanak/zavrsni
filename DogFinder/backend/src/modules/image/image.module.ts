import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImagesController } from './image.controller';
import { Image } from './image.entity';
import { ImageService } from './image.service';
import { ImageListener } from './image.listener';
import { DogNNModule } from '../dognn/dognn.module';
import { PostModule } from '../post/post.module';

@Module({
  imports: [TypeOrmModule.forFeature([Image]), DogNNModule, PostModule],
  controllers: [ImagesController],
  providers: [ImageService, ImageListener],
  exports: [ImageService, ImageListener],
})
export class ImageModule {}
