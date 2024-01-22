export const CustomPagesModuleLazyRoutes = {
  path: 'pages',
  loadChildren: () =>
    import('./custom-pages.module').then(m => m.CustomPagesModule),
};
