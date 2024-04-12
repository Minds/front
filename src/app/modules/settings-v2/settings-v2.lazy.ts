export const SettingsV2ModuleLazyRoutes = {
  path: 'settings',
  loadChildren: () =>
    import('./settings-v2.module').then((m) => m.SettingsV2Module),
};
