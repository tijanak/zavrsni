import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Multer } from 'multer';
import { environment } from '@dog-finder/environment';
import { Readable } from 'stream';
import * as fs from 'fs';
import * as path from 'path';
import * as mime from 'mime-types';
@Injectable()
export class DognnService {
  axios = require('axios');
  constructor(private readonly httpService: HttpService) {
    /*this.axios.get(`${environment.MODEL_URL}db`).then((response) => {
      Logger.log(response.data);
    });*/
  }

  streamToBuffer = async (stream: Readable): Promise<Buffer> => {
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  };
  async getMatchingPosts(post_id) {
    try {
      const response = await this.axios.get(
        `${environment.MODEL_URL}matches/${post_id}`
      );
      return response.data;
    } catch (error) {
      throw new Error(`Error calling API: ${error.message}`);
    }
  }
  async encode(filePath: string,image_id:number) {
    const formData = new FormData();

    const fileStream = fs.createReadStream(filePath);
    const fileName = path.basename(filePath);
    const fileMimeType =
      mime.lookup(path.extname(filePath)) || 'application/octet-stream';
    const blob = new Blob([await this.streamToBuffer(fileStream as Readable)], {
      type: fileMimeType,
    });
    formData.append('file', blob, filePath);
    try {
      Logger.log(`${environment.MODEL_URL}/predict/${image_id}`);
      const response = await this.axios.post(
        `${environment.MODEL_URL}predict/${image_id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            contentType: fileMimeType,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Error calling API: ${error.message}`);
    }
  }
}
