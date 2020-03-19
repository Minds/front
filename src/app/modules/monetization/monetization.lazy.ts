export const MonetizationModuleLazyRoutes = {
  path: 'wallet/revenue',
  loadChildren: () =>
    import('./monetization.module').then(m => m.MonetizationModule),
};
