export const HelpdeskModuleLazyRoutes = {
  path: 'help',
  loadChildren: () => import('./helpdesk.module').then(m => m.HelpdeskModule),
};
