import { Injectable } from '@nestjs/common';
@Injectable()
export class AppService {
  constructor() {}
  async getData() {
    return 'Hello API';
  }
}
