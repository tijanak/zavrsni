import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateImageDto } from '@dog-finder/models';
import * as fs from 'fs';
import path from 'path';
import { Repository } from 'typeorm';
import { Image } from './image.entity';
const imagesFolder = 'backend/public/images/';
export const imagesPath = path.join(__dirname, '../../', imagesFolder);
@Injectable()
export class ImageService {
  constructor(@InjectRepository(Image) private imageRepo: Repository<Image>) {}

  createForPost(imageDto: CreateImageDto, postId: number) {
    const image = this.imageRepo.create({
      fileName: imageDto.fileName,
      vector: imageDto.vector,
      post: { id: postId },
    });
    return this.imageRepo.save(image, {});
  }
  async findImagesByPostId(postId: number): Promise<Image[]> {
    const images = await this.imageRepo.find({
      where: { post: { id: postId } },
    });

    return images;
  }
  async deleteFile(filename: string) {
    const filePath = path.join(imagesPath, filename);
    try {
      await fs.promises.unlink(filePath);
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new NotFoundException(
          `Slika ${filename} nije pronadjena u folderu`
        );
      }
      throw error;
    }
  }
  async delete(id: number) {
    const image = await this.imageRepo.findOne({
      where: { id },
    });
    if (!image) {
      throw new NotFoundException(`Slika ne postoji.`);
    }
    const filename = image.fileName;
    await this.imageRepo.delete(image.id);

    await this.deleteFile(filename);
  }

  async findImageWithPostCreator(imageId: number): Promise<Image | null> {
    return this.imageRepo.findOne({
      where: { id: imageId },
      relations: ['post', 'post.creator'],
    });
  }
}
