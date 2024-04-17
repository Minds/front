export const NetworkAdminConsoleModuleLazyRoutes = {
  path: 'network/admin',
  loadChildren: () =>
    import('./network-admin-console.module').then(
      (m) => m.NetworkAdminConsoleModule
    ),
};
