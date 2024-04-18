export const AuxModuleLazyRoutes = {
  path: 'p',
  loadChildren: () => import('./aux-pages.module').then((m) => m.AuxModule),
};
