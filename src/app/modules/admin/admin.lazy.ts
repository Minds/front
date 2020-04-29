export const AdminModuleLazyRoutes = {
  path: 'admin',
  loadChildren: () => import('./admin.module').then(m => m.AdminModule),
};
