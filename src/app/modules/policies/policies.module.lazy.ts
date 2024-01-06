export const NetworkAdminConsoleModuleLazyRoutes = {
  path: 'policies',
  loadChildren: () => import('./policies.module').then(m => m.PoliciesModule),
};
