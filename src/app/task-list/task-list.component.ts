import { Component } from '@angular/core';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { ITaskData, ITaskFilter, STATUS_NAME } from '../models/task.model';
import { TaskService } from '../services/task.service';
import { PageEvent } from '@angular/material/paginator';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent {
  STATUS_NAME = STATUS_NAME;

  form = new FormGroup({
    username: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    text: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  pageEvent$ = new BehaviorSubject<ITaskFilter>({ page: 1 });
  displayedColumns: string[] = ['username', 'email', 'text', 'status'];
  dataSource$: Observable<ITaskData> = this.pageEvent$.pipe(
    switchMap((filter) => this.taskService.getTasks(filter)),
  );

  constructor(
    private readonly taskService: TaskService,
    private readonly _snackBar: MatSnackBar,
  ) {}

  handlePageEvent(event: PageEvent) {
    this.pageEvent$.next({
      ...this.pageEvent$.value,
      page: event.pageIndex + 1,
    });
  }

  handleSortEvent(event: Sort) {
    if (event.direction) {
      this.pageEvent$.next({
        ...this.pageEvent$.value,
        sort_field: event.active,
        sort_direction: event.direction,
      });
    } else {
      this.pageEvent$.next({ page: this.pageEvent$.value.page });
    }
  }

  addTask() {
    if (!this.form.valid) {
      return;
    }

    this.taskService.saveTask(this.form.getRawValue()).subscribe(() => {
      this.pageEvent$.next({ page: 1 });
      this._snackBar.open('Задача добавлена!', '', { duration: 5 * 1000 });
    });
  }
}
