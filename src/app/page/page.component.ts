import { Component } from '@angular/core';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrl: './page.component.scss',
})
export class PageComponent {
  isLogin$ = this.loginService.isLogin$;

  constructor(
    private loginService: LoginService,
    private readonly router: Router,
  ) {}

  logout() {
    this.loginService.logout();
    this.router.navigate(['']);
  }
}
