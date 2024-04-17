export const MobileModuleLazyRoutes = {
  path: 'mobile',
  loadChildren: () => import('./mobile.module').then((m) => m.MobileModule),
};
