import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) {}
  async getData() {
    const response = await firstValueFrom(
      this.httpService.get('http://dognn:5000/')
    );
    return 'doggnn returned= ' + response.data;
  }
}
