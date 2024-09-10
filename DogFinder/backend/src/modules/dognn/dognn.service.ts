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
    this.axios.get(`${environment.MODEL_URL}db`).then((response) => {
      Logger.log(response.data);
    });
  }

  streamToBuffer = async (stream: Readable): Promise<Buffer> => {
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  };
  async encode(filePath: string) {
    const formData = new FormData();

    // Create a readable stream from the file path
    const fileStream = fs.createReadStream(filePath);

    // Get the file name and mimetype (you might need to infer or provide this)
    const fileName = path.basename(filePath);
    const fileMimeType =
      mime.lookup(path.extname(filePath)) || 'application/octet-stream';
    const blob = new Blob([await this.streamToBuffer(fileStream as Readable)], {
      type: fileMimeType,
    });
    // Append the file stream to FormData
    formData.append('file', blob, filePath);
    try {
      Logger.log(`${environment.MODEL_URL}predict/`);
      const response = await this.axios.post(
        `${environment.MODEL_URL}predict`,
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
