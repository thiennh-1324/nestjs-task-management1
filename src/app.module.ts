import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { I18nModule } from 'nestjs-i18n';
import * as path from 'path';
import { AppController } from './app.controller';
import { I18nMiddleware } from './middleware/i18n.middleware';
import { TasksModule } from '@/tasks/tasks.module';
import { DEFAULT_LANGUAGE } from '@/constant/app-constant';
import { AppService } from '@/app.service';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: DEFAULT_LANGUAGE,
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
    }),
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(I18nMiddleware).forRoutes('*');
  }
}
