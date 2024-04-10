export const DiscoveryModuleLazyRoutes = {
  path: 'discovery',
  loadChildren: () =>
    import('./discovery.module').then((m) => m.DiscoveryModule),
};
