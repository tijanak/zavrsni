import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DognnService } from './dognn.service';
import { HttpModule } from '@nestjs/axios';
import { DognnController } from './dognn.controller';

@Module({
  imports: [HttpModule],
  controllers: [DognnController],
  providers: [DognnService],
  exports: [DognnService],
})
export class DogNNModule {}
