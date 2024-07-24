import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from 'src/tasks/entities/task.entity';
import { User } from 'src/auth/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, User])],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TypeOrmModule],
})
export class TasksModule {}
