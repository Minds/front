export const MembershipsLazyRoutes = {
  path: 'memberships',
  loadChildren: () =>
    import('./memberships-lazy.module').then(m => m.MembershipsLazyModule),
};
