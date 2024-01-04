import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { catchError, EMPTY } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  showPassword: boolean = false;

  form = new FormGroup({
    username: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  constructor(
    private readonly loginService: LoginService,
    private readonly router: Router,
  ) {}

  login() {
    if (this.form.invalid) {
      return;
    }

    this.loginService
      .login(this.form.getRawValue())
      .pipe(
        catchError((err: Error) => {
          if (err.cause) {
            this.form.setErrors(err.cause);
          }

          return EMPTY;
        }),
      )
      .subscribe(() => {
        this.router.navigate(['admin']);
      });
  }
}
