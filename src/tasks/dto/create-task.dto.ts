import { IsBoolean, IsInt, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsBoolean()
  isActive: boolean;

  @IsInt()
  userId: number;
}
