import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { NotFound } from './components/not-found/not-found';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    title: 'COACH ABOU SAMRA | Online Fitness Coaching',
  },
  {
    path: '404',
    component: NotFound,
    title: 'Page Not Found | COACH ABOU SAMRA',
  },
  {
    path: '**',
    component: NotFound,
    title: 'Page Not Found | COACH ABOU SAMRA',
  },
];
