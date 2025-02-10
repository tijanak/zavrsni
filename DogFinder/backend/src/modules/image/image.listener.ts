import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { ImageService } from './image.service';
import { PostDeletedEvent } from '../post/post.events';

@Injectable()
export class ImageListener {
  constructor(private readonly imageService: ImageService) {}

  @OnEvent('post.deleted')
  async handlePostDeletedEvent(event: PostDeletedEvent) {
    for (const image of event.images) {
      await this.imageService.deleteFile(image.fileName);
    }
  }
}
