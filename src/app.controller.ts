import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Lang } from 'src/decorators/lang.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // [GET] /api/v1
  @Get()
  async getHello(@Lang() lang: string) {
    return await this.appService.getHello(lang);
  }
}
