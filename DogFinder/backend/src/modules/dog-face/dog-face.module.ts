import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DogFace } from './dog-face.entity';
import { DogFacesService } from './dog-face.service';
import { Image } from '../image/image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DogFace, Image])],
  providers: [DogFacesService],
  exports: [DogFacesService],
})
export class DogFacesModule {}
