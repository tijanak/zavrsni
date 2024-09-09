import { Image } from '../image/image.entity';

export class PostDeletedEvent {
  constructor(
    public readonly postId: number,
    public readonly images: Image[]
  ) {}
}
