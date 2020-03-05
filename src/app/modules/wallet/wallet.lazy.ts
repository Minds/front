export const WalletModuleLazyRoutes = {
  path: 'wallet',
  loadChildren: () => import('./wallet.module').then(m => m.WalletModule),
};
