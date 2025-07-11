import { Route } from '@angular/router';

export const groupRoutes: Route[] = [
  {
    path: 'groups',
    loadChildren: () => import('./groups.module').then((m) => m.GroupsModule),
  },
  {
    path: 'group',
    loadChildren: () => import('./v2/group.module').then((m) => m.GroupModule),
  },
];
