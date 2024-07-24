import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { User } from 'src/auth/entities/user.entity';
import { AppDataSource } from 'src/config/data-source';
import { BaseResponse } from 'src/utils/base-response.utils';

export enum UserQueryType {
  BASIC,
  WITH_TASKS,
}

const userRepository = AppDataSource.getRepository(User);
export const findUserById = async (
  userId: number,
  type: UserQueryType,
  res: Response,
  messageNotFound: string,
) => {
  try {
    let user: User;
    switch (type) {
      case UserQueryType.BASIC:
        user = await userRepository.findOneOrFail({
          where: { id: userId },
        });
        break;
      case UserQueryType.WITH_TASKS:
        user = await userRepository.findOneOrFail({
          where: { id: userId },
          relations: { tasks: true },
        });
        break;
      default:
        user = await userRepository.findOneOrFail({
          where: { id: userId },
        });
        break;
    }
    return user;
  } catch (error) {
    return BaseResponse.new(
      res,
      HttpStatus.NOT_FOUND,
      messageNotFound,
      null,
    ).send();
  }
};
