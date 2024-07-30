import { IsString, MaxLength, MinLength } from 'class-validator';
import {
  MAX_LENGTH_PASSWORD,
  MAX_LENGTH_USERNAME,
  MIN_LENGTH_PASSWORD,
  MIN_LENGTH_USERNAME,
} from 'src/constant/app-constant';

export class AuthDto {
  @IsString()
  @MinLength(MIN_LENGTH_USERNAME)
  @MaxLength(MAX_LENGTH_USERNAME)
  username: string;

  @IsString()
  @MinLength(MIN_LENGTH_PASSWORD)
  @MaxLength(MAX_LENGTH_PASSWORD)
  password: string;
}
