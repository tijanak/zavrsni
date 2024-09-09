import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Multer } from 'multer';
import { environment } from '@dog-finder/environment';
@Injectable()
export class DognnService {
  constructor(private readonly httpService: HttpService) {}
  async encode(file: Multer.File) {
    const axios = require('axios');

    const formData = new FormData();
    formData.append('file', file.buffer, file.originalname);

    try {
      const response = await axios.post(environment.MODEL_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(`Error calling API: ${error.message}`);
    }
  }
}
