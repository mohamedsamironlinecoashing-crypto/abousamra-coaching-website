import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { NotFound } from './components/not-found/not-found';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    title: 'Abou samra Coaching Master of Transformations',
  },
  {
    path: '404',
    component: NotFound,
    title: 'Abou samra Coaching Master of Transformations',
  },
  {
    path: '**',
    component: NotFound,
    title: 'Abou samra Coaching Master of Transformations',
  },
];
