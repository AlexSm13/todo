import { Component } from '@angular/core';
import { BehaviorSubject, map, switchMap } from 'rxjs';
import { ITask, ITaskFilter } from '../models/task.model';
import { TaskService } from '../services/task.service';
import { PageEvent } from '@angular/material/paginator';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { TOKEN_KEY } from '../services/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent {
  pageEvent$ = new BehaviorSubject<ITaskFilter>({ page: 1 });
  displayedColumns: string[] = ['username', 'email', 'text', 'status'];
  dataSource$ = this.pageEvent$.pipe(
    switchMap((filter) => this.taskService.getTasks(filter)),
    map((data) => {
      const tasks = data.tasks.map((task) => {
        const completed = [10, 11].includes(task.status);

        return { ...task, completed };
      });

      return { ...data, tasks };
    }),
  );

  constructor(
    private readonly taskService: TaskService,
    private readonly _snackBar: MatSnackBar,
    private readonly router: Router,
  ) {}

  handlePageEvent(event: PageEvent) {
    this.pageEvent$.next({
      page: event.pageIndex + 1,
    });
  }

  saveStatus(
    event: MatCheckboxChange,
    taskId: number,
    prevStatus: 0 | 1 | 10 | 11,
  ) {
    let status: 0 | 1 | 10 | 11;

    if (event.checked) {
      status = prevStatus === 1 ? 11 : 10;
    } else {
      status = +prevStatus.toString().split('')[1] === 1 ? 1 : 0;
    }

    this.editTask(taskId, { status });
  }

  saveNewText(text: string, taskId: number, prevStatus: 0 | 1 | 10 | 11) {
    let status: 0 | 1 | 10 | 11 = prevStatus;

    if (prevStatus === 0) {
      status = 1;
    }

    if (prevStatus === 10) {
      status = 11;
    }

    this.editTask(taskId, { text, status });
  }

  private editTask(
    taskId: number,
    data: Partial<Pick<ITask, 'text' | 'status'>>,
  ) {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      this._snackBar.open('Сессия истекла', '', { duration: 5 * 1000 });
      this.router.navigate(['login']);
      return;
    }

    this.taskService.editTask(token, taskId, data).subscribe();
  }
}
