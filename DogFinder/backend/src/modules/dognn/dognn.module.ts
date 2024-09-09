import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DognnService } from './dognn.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [DognnService],
  exports: [DognnService],
})
export class DogNNModule {}
