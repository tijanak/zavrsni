import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import * as fs from 'fs';
import { diskStorage } from 'multer';
import * as path from 'path';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ImageOwnerGuard } from './guards/owner.guard';
import { ImageService, imagesPath } from './image.service';
import { OwnerGuard } from '../post/guards/owner.guard';
import { DognnService } from '../dognn/dognn.service';

@Controller('images')
export class ImagesController {
  constructor(
    private imageService: ImageService,
    private doggnnService: DognnService
  ) {}
  @UseGuards(JwtAuthGuard, OwnerGuard)
  @Post(':id')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = imagesPath;
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const ext = path.extname(file.originalname);
          const filename = `${Date.now()}_${file.originalname}`;
          cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          return cb(new Error('Samo slike su dozvoljene'), false);
        }
        cb(null, true);
      },
    })
  )
  async upload(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Param('id', ParseIntPipe) id: number
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Nisu poslati fajlovi.');
    }

    try {
      const images = await Promise.all(
        await files.map(async (file) => {
          let vector = [];
          try {
            vector = await this.doggnnService.encode(
              path.join(imagesPath, file.filename)
            );
          } catch (e) {
            Logger.log(e);
          }
          this.imageService.createForPost(
            { fileName: file.filename, vector },
            id
          );
        })
      );

      return images;
    } catch (error) {
      Logger.log(error);
      throw new BadRequestException('Greska u procesuiranju fajlova.');
    }
  }
  @UseGuards(JwtAuthGuard, ImageOwnerGuard)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.imageService.delete(id);
  }
  @Get('post/:id')
  async getForAuction(@Param('id', ParseIntPipe) id: number) {
    return this.imageService.findImagesByPostId(id);
  }
  @Get(':filename')
  async getImage(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = path.join(imagesPath, filename);

    try {
      await fs.promises.access(filePath);

      res.sendFile(filePath);
    } catch (error) {
      Logger.log(error);
      throw new NotFoundException('Slika nije pronadjena');
    }
  }
}
