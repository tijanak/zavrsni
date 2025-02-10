import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { CreatePostDto } from './dto/post.create-dto';
import { UpdatePostDto } from './dto/post.update-dto';
import { User } from '../user/user.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PostDeletedEvent } from './post.events';
@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly eventEmitter: EventEmitter2
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

  async create(createPostDto: CreatePostDto, creator: User): Promise<Post> {
    const post = this.postRepository.create(createPostDto);
    post.creator = creator;
    return this.postRepository.save(post);
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    return this.postRepository.save({ id, ...updatePostDto });
  }

  async remove(id: number): Promise<void> {
    let post = await this.postRepository.findOne({
      where: [{ id: id }],
      relations: ['images'],
    });
    if (!post) {
      throw new BadRequestException('Objava ne postoji');
    }
    try {
      await this.postRepository.delete(id);

      this.eventEmitter.emit(
        'post.deleted',
        new PostDeletedEvent(id, post.images)
      );
    } catch (error) {
      Logger.error('Error deleting auction:', error);
      throw new InternalServerErrorException('Greska u toku brisanja');
    }

  }
}
