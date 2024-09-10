import { Controller, Get, Param } from '@nestjs/common';
import { DognnService } from './dognn.service';

@Controller('nn')
export class DognnController {
  constructor(private readonly dognnService: DognnService) {}

  @Get('matches/:id')
  async getMatchingPosts(@Param('id') id: number) {
    return this.dognnService.getMatchingPosts(id);
  }
}
