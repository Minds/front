export const CanaryModuleLazyRoutes = {
  path: 'canary',
  loadChildren: () => import('./canary.module').then(m => m.CanaryModule),
};
