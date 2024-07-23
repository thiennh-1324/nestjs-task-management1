import { DEFAULT_LANGUAGE } from '@/constant/app-constant';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class I18nMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const lang =
      req.headers['accept-language']?.split(',')[0] || DEFAULT_LANGUAGE;
    req['language'] = lang;
    next();
  }
}
