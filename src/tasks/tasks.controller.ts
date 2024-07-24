import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Res,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Response } from 'express';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Lang } from 'src/decorators/lang.decorator';
import { ValidationPipe } from 'src/validation/validation.pipe';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // [POST] /api/tasks
  @Post()
  createTask(
    @Lang() lang: string,
    @Res() res: Response,
    @Body(ValidationPipe) createTaskDto: CreateTaskDto,
  ) {
    return this.tasksService.create(lang, res, createTaskDto);
  }

  // [GET] /api/tasks
  @Get()
  findAllTasks(
    @Lang() lang: string,
    @Res() res: Response,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.tasksService.findAll(lang, res, paginationDto);
  }

  // [GET] /api/tasks/:id
  @Get(':id')
  findTaskById(
    @Lang() lang: string,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    return this.tasksService.findOne(lang, res, +id);
  }

  // [PUT] /api/tasks/:id
  @Put(':id')
  updateTask(
    @Lang() lang: string,
    @Res() res: Response,
    @Param('id') id: string,
    @Body(ValidationPipe) updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(lang, res, +id, updateTaskDto);
  }

  // [DELETE] /api/tasks/:id
  @Delete(':id')
  removeTask(
    @Lang() lang: string,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    return this.tasksService.remove(lang, res, +id);
  }
}
