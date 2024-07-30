import {
  Injectable,
  HttpStatus,
  UnauthorizedException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { BaseResponse } from 'src/utils/base-response.utils';
import { I18nService } from 'nestjs-i18n';
import handleDatabaseOperation from 'src/utils/handle-database-async';
import { findUserByUsername, UserQueryType } from 'src/utils/user.utils';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private readonly authRepository: Repository<User>,
    private readonly i18n: I18nService,
    private readonly jwtService: JwtService,
  ) {}

  private readonly PW_REG_EXP =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/;

  private validatePassword(password: string, lang: string): void {
    if (!this.PW_REG_EXP.test(password)) {
      throw new BadRequestException(
        this.i18n.translate('user.validation.password', { lang }),
      );
    }
  }

  async createUser(lang: string, res: Response, authDto: AuthDto) {
    const { username, password } = authDto;

    this.logger.debug('Creating a new user', { username });

    const existingUser = await this.authRepository.findOne({
      where: { username },
    });
    if (existingUser) {
      return BaseResponse.new(
        res,
        HttpStatus.BAD_REQUEST,
        await this.i18n.translate('user.error.existed', { lang }),
        null,
      ).send();
    }

    this.validatePassword(password, lang);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = this.authRepository.create({
      username,
      password: hashedPassword,
    });
    await handleDatabaseOperation(
      res,
      async () => {
        await this.authRepository.save(newUser);
        this.logger.log('User created successfully', { username });
        return null;
      },
      await this.i18n.translate('user.success.create', { lang }),
      await this.i18n.translate('user.error.server', { lang }),
    );
  }

  async login(lang: string, res: Response, authDto: AuthDto) {
    const { username, password } = authDto;
    const user = await findUserByUsername(
      username,
      UserQueryType.BASIC,
      res,
      await this.i18n.translate('user.error.notFound', { lang }),
    );
    const isMatchedPassword = await bcrypt.compare(password, user.password);
    if (!isMatchedPassword)
      throw new UnauthorizedException(
        await this.i18n.translate('user.error.pwNotMatch', { lang }),
      );
    const payload = { username: user.username, sub: user.id };
    const token = await this.jwtService.sign(payload);
    return BaseResponse.new(
      res,
      HttpStatus.OK,
      await this.i18n.translate('user.success.login', { lang }),
      { token },
    ).send();
  }

  async validateUser(username: string, lang: string): Promise<User | null> {
    const user = await this.authRepository.findOne({ where: { username } });
    if (!user) {
      throw new UnauthorizedException(
        await this.i18n.translate('user.error.notFound', { lang }),
      );
    }
    return user;
  }
}
