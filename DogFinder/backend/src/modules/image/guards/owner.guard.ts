import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ImageService } from '../image.service';

@Injectable()
export class ImageOwnerGuard implements CanActivate {
  constructor(
    private imageService: ImageService,

    private readonly reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const imageId = +request.params.id;
    if (!user || !user.id) {
      throw new ForbiddenException('Nije autorizovano.');
    }

    const image = await this.imageService.findImageWithPostCreator(imageId);

    if (!image) {
      throw new ForbiddenException('Slika nije pronadjena.');
    }

    const ownerId = image.post?.creator?.id;

    if (user.id !== ownerId) {
      throw new ForbiddenException('Samo vlasnik moze da brise.');
    }

    return true;
  }
}
