import { Lang } from '@/decorators/lang.decorator';
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // [GET] /api/v1
  @Get()
  async getHello(@Lang() lang: string) {
    return await this.appService.getHello(lang);
  }
}
