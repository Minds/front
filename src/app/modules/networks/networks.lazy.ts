export const NetworksModuleLazyRoutes = {
  path: 'networks',
  loadChildren: () => import('./networks.module').then((m) => m.NetworksModule),
};
