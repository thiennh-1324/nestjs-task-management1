import { NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { AppDataSource } from 'src/config/data-source';
import { Task } from 'src/tasks/entities/task.entity';

export enum TaskQueryType {
  BASIC,
  WITH_USER,
}

const taskRepository = AppDataSource.getRepository(Task);

export const findTaskById = async (
  taskId: number,
  type: TaskQueryType,
  res: Response,
  messageNotFound: string,
) => {
  try {
    let task: Task;
    switch (type) {
      case TaskQueryType.BASIC:
        task = await taskRepository.findOneOrFail({
          where: { id: taskId },
        });
        break;
      case TaskQueryType.WITH_USER:
        task = await taskRepository.findOneOrFail({
          where: { id: taskId },
          relations: { user: true },
        });
        break;
      default:
        task = await taskRepository.findOneOrFail({
          where: { id: taskId },
        });
        break;
    }
    return task;
  } catch (error) {
    throw new NotFoundException({ message: messageNotFound, error });
  }
};
