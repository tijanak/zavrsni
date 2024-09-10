import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PostService } from '../post.service';

@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(
    private readonly postService: PostService,
    private readonly reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const postId = +request.params.id;
    if (!Number.isInteger(postId)) {
      throw new BadRequestException();
    }
    const post = await this.postService.findOne(postId, ['creator']);

    if (!post) {
      throw new ForbiddenException('Objava ne postoji');
    }
    if (post.creator.id !== user.id) {
      throw new ForbiddenException('Not authorized to access this post');
    }

    return true;
  }
}
