export const AnalyticsModuleLazyRoutes = {
  path: 'analytics',
  loadChildren: () => import('./analytics.module').then(m => m.AnalyticsModule),
};
