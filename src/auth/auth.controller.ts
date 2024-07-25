import { Body, Controller, Post, Res, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { Lang } from 'src/decorators/lang.decorator';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // [POST] /api/v1/auth/sign-up
  @Post('/sign-up')
  signUp(
    @Lang() lang: string,
    @Res() res: Response,
    @Body(ValidationPipe) authDto: AuthDto,
  ) {
    return this.authService.createUser(lang, res, authDto);
  }

  // [POST] /api/v1/auth/sign-in
  @Post('/sign-in')
  signIn(
    @Lang() lang: string,
    @Res() res: Response,
    @Body(ValidationPipe) authDto: AuthDto,
  ) {
    return this.authService.login(lang, res, authDto);
  }
}
