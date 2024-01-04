import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaskListComponent } from './task-list/task-list.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { PageComponent } from './page/page.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: PageComponent,
    children: [
      { path: '', component: TaskListComponent },
      { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
      { path: '**', redirectTo: '' },
    ],
  },
  { path: '**', component: PageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
