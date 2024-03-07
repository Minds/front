/** Lazy routes for network admin analytics module. */
export const NetworkAdminAnalyticsLazyRoutes = {
  path: 'analytics',
  loadChildren: () =>
    import('./analytics.module').then(m => m.NetworkAdminAnalyticsModule),
};
