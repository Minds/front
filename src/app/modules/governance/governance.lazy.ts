export const GovernanceModuleLazyRoutes = {
  path: 'governance',
  loadChildren: () =>
    import('./governance.module').then(m => m.GovernanceModule),
};
