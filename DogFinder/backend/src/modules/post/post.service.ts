import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { CreatePostDto } from './dto/post.create-dto';
import { UpdatePostDto } from './dto/post.update-dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>
  ) {}

  async findAll(): Promise<Post[]> {
    return this.postRepository.find();
  }

  async findOne(id: number, relations: string[] = []): Promise<Post> {
    return this.postRepository.findOne({
      where: [{ id: id }],
      relations,
    });
  }

  async create(createPostDto: CreatePostDto): Promise<Post> {
    return this.postRepository.save(createPostDto);
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    return this.postRepository.save({ id, ...updatePostDto });
  }

  async remove(id: number): Promise<void> {
    await this.postRepository.delete(id);
  }
}
