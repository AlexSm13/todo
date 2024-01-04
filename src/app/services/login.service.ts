import { Injectable } from '@angular/core';
import { AbstractService } from './abstract.service';
import { BehaviorSubject, tap } from 'rxjs';
import { ILogin } from '../models/login';
import { Router } from '@angular/router';

export const TOKEN_KEY = 'token';

@Injectable({
  providedIn: 'root',
})
export class LoginService extends AbstractService {
  isLogin$ = new BehaviorSubject(!!localStorage.getItem(TOKEN_KEY));

  login(filters: ILogin) {
    const form = new FormData();
    form.append('username', filters.username);
    form.append('password', filters.password);

    return this.post<{ token: string }>('/login', form).pipe(
      tap((data) => {
        if (data && data.token) {
          localStorage.setItem(TOKEN_KEY, data.token);
          this.isLogin$.next(true);
        }
      }),
    );
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    this.isLogin$.next(false);
  }
}
