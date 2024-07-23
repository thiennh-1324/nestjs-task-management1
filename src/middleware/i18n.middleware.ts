import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { DEFAULT_LANGUAGE } from 'src/constant/app-constant';

@Injectable()
export class I18nMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const lang =
      req.headers['accept-language']?.split(',')[0] || DEFAULT_LANGUAGE;
    req['language'] = lang;
    next();
  }
}
