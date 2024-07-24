import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { BaseResponse } from 'src/utils/base-response.utils';

const handleDatabaseOperation = async (
  res: Response,
  callback: () => Promise<any>,
  successMessage: string,
  errorMessage: string,
) => {
  try {
    const result = await callback();
    return BaseResponse.new(res, HttpStatus.OK, successMessage, result).send();
  } catch (error) {
    return BaseResponse.new(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      errorMessage,
      error,
    ).send();
  }
};

export default handleDatabaseOperation;
