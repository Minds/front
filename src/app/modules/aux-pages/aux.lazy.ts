export const AuxModuleLazyRoutes = {
  path: 'p',
  loadChildren: () => import('./aux.module').then(m => m.AuxModule),
};
