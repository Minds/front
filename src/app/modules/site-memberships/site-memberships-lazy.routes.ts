export const SiteMembershipsLazyRoutes = {
  path: 'memberships',
  loadChildren: () =>
    import('./site-memberships-lazy.module').then(
      (m) => m.SiteMembershipsLazyModule
    ),
};
