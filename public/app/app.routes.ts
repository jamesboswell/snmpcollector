import { Routes } from '@angular/router';
import { Home } from '../home';
import { Login } from '../login';
import { AuthGuard } from '../common/auth.guard';

export const routes: Routes = [
  { path: '',       component: Login },
  { path: 'login',  component: Login },
  { path: 'home',   component: Home, canActivate: [AuthGuard] },
  { path: '**',     component: Login },
];
