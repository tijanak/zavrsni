import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/post.create-dto';
import { UpdatePostDto } from './dto/post.update-dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  async findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.postService.findOne(id);
  }

  @Post()
  async create(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(id, updatePostDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.postService.remove(id);
  }
}
