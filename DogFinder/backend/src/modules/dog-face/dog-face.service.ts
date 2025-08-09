import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DogFace } from './dog-face.entity';
import { Repository } from 'typeorm';
import { Image } from '../image/image.entity';
import { DataSource } from 'typeorm';
@Injectable()
export class DogFacesService {
  constructor(
    @InjectRepository(DogFace)
    private dogFaceRepo: Repository<DogFace>,

    @InjectRepository(Image)
    private imageRepo: Repository<Image>,private readonly dataSource: DataSource
  ) {}

 async createFromVectors(imageId: number, vectors: number[][]): Promise<void> {
  const image = await this.imageRepo.findOneBy({ id: imageId });
  if (!image) throw new Error('Image not found');

  await this.dataSource.query(
  `
  INSERT INTO dog_faces (image_id, embedding)
  VALUES ${vectors.map((_, i) => `($1, $${i + 2}::vector)`).join(', ')}
  `,
  [imageId, ...vectors]
);
}

}
