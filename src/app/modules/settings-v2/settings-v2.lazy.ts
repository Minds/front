export const SettingsV2ModuleLazyRoutes = {
  path: 'somepathToDisableThis/settings/canary/',
  loadChildren: () =>
    import('./settings-v2.module').then(m => m.SettingsV2Module),
};
