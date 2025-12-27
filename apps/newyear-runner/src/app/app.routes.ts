import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('@newyear-runner/pages/home').then((c) => c.HomePage),
  },
  {
    path: 'game',
    loadComponent: () => import('@newyear-runner/pages/game').then((c) => c.GamePage),
  },
  {
    path: '**',
    redirectTo: '',
  }
];
