import { DEFAULT_LANGUAGE } from 'src/constant/app-constant';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Lang = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request['language'] || DEFAULT_LANGUAGE;
  },
);
