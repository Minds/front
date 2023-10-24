export const UpgradeModuleLazyRoutes = {
  path: 'upgrade',
  loadChildren: () => import('./upgrade.module').then(m => m.UpgradeModule),
};
