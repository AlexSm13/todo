import { Injectable } from '@angular/core';
import { AbstractService } from './abstract.service';
import { map, Observable } from 'rxjs';
import { ITask, ITaskData, ITaskFilter } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService extends AbstractService {
  getTasks(filters: ITaskFilter): Observable<ITaskData> {
    return this.get<ITaskData>(filters).pipe(
      map((data) => (data ? data : { tasks: [], total_task_count: 0 })),
    );
  }

  saveTask(task: Omit<ITask, 'id' | 'status'>) {
    const form = new FormData();
    form.append('username', task.username);
    form.append('email', task.email);
    form.append('text', task.text);

    return this.post<ITask>('/create', form);
  }

  editTask(
    token: string,
    taskId: number,
    task: Partial<Pick<ITask, 'text' | 'status'>>,
  ) {
    const form = new FormData();
    form.append('token', token);

    if (task.text) {
      form.append('text', task.text);
    }

    if (task.status) {
      form.append('status', task.status.toString());
    }

    return this.post(`/edit/${taskId}`, form);
  }
}
