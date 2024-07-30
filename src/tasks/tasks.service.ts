import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Response } from 'express';
import { paginate } from 'nestjs-typeorm-paginate';
import { Task } from 'src/tasks/entities/task.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { BaseResponse } from 'src/utils/base-response.utils';
import { I18nService } from 'nestjs-i18n';
import { DEFAULT_PAGE, DEFAULT_PER_PAGE } from 'src/constant/app-constant';
import handleDatabaseOperation from 'src/utils/handle-database-async';
import { User } from 'src/auth/entities/user.entity';
import { findTaskById, TaskQueryType } from 'src/utils/task.utils';
import { findUserById, UserQueryType } from 'src/utils/user.utils';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly i18n: I18nService,
  ) {}

  async create(lang: string, res: Response, createTaskDto: CreateTaskDto) {
    const userId = createTaskDto.userId;
    const user = await findUserById(
      userId,
      UserQueryType.BASIC,
      res,
      await this.i18n.translate('user.error.notFound', { lang }),
    );

    const newTask = this.taskRepository.create({ ...createTaskDto, user });
    await handleDatabaseOperation(
      res,
      async () => {
        await this.taskRepository.save(newTask);
        return { task: newTask };
      },
      await this.i18n.translate('task.success.create', { lang }),
      await this.i18n.translate('task.error.server', { lang }),
    );
  }

  async findAll(lang: string, res: Response, paginationDto: PaginationDto) {
    const { page = DEFAULT_PAGE, limit = DEFAULT_PER_PAGE } = paginationDto;
    const result = paginate<Task>(this.taskRepository, { page, limit });
    return BaseResponse.new(
      res,
      HttpStatus.OK,
      await this.i18n.translate('task.success.fetch', { lang }),
      {
        tasks: (await result).items,
        paging: (await result).meta,
      },
    ).send();
  }

  async findOne(lang: string, res: Response, id: number) {
    const task = await findTaskById(
      id,
      TaskQueryType.BASIC,
      res,
      await this.i18n.translate('task.error.notFound', { lang }),
    );
    return BaseResponse.new(
      res,
      HttpStatus.OK,
      await this.i18n.translate('task.success.fetch', { lang }),
      task,
    ).send();
  }

  async update(
    lang: string,
    res: Response,
    id: number,
    updateTaskDto: UpdateTaskDto,
  ) {
    const task = await findTaskById(
      id,
      TaskQueryType.BASIC,
      res,
      await this.i18n.translate('task.error.notFound', { lang }),
    );

    const userId = updateTaskDto.userId;
    const user = await findUserById(
      userId,
      UserQueryType.BASIC,
      res,
      await this.i18n.translate('user.error.notFound', { lang }),
    );
    this.taskRepository.merge(task, {
      ...updateTaskDto,
      user,
    });
    await handleDatabaseOperation(
      res,
      async () => {
        await this.taskRepository.save(task);
        return task;
      },
      await this.i18n.translate('task.success.update', { lang }),
      await this.i18n.translate('task.error.server', { lang }),
    );
  }

  async remove(lang: string, res: Response, id: number) {
    await findTaskById(
      id,
      TaskQueryType.BASIC,
      res,
      await this.i18n.translate('task.error.notFound', { lang }),
    );
    await handleDatabaseOperation(
      res,
      async () => {
        const deleteResult = await this.taskRepository.delete(id);
        return deleteResult.affected;
      },
      await this.i18n.translate('task.success.delete', { lang }),
      await this.i18n.translate('task.error.server', { lang }),
    );
  }
}
