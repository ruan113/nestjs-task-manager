import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;

    // define a temporary array to hold the result
    let tasks = this.getAllTasks();

    // do something with status
    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    // do something with search
    if (search) {
      tasks = tasks.filter((task) => {
        if (task.title.includes(search) || task.description.includes(search)) {
          return true;
        }
        return false;
      });
    }
    // return final result
    return tasks;
  }

  getTaskById(id: string) {
    // try to get task
    const found = this.tasks.find((it: Task) => it.id === id);

    // if not found, throw an error (404 not found)
    if (!found) {
      throw new NotFoundException();
    }

    // otherwise, return the found task
    return found;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;

    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);

    return task;
  }

  deleteTask(id: string): Task {
    const task = this.getTaskById(id);
    const indexToRemove = this.tasks.findIndex((it: Task) => it.id === task.id);
    return this.tasks.splice(indexToRemove, 1)[0];
  }

  updateTask(id: string, newTaskInfo: Task): Task {
    delete newTaskInfo.id;

    const indexToUpdate = this.tasks.findIndex((it: Task) => it.id === id);
    this.tasks[indexToUpdate] = {
      ...this.tasks[indexToUpdate],
      ...newTaskInfo,
    };

    return this.tasks[indexToUpdate];
  }

  updateTaskStatus(id: string, newStatus: TaskStatus) {
    const task = this.getTaskById(id);
    task.status = newStatus;
    return task;
  }
}
