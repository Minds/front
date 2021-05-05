import { caseInsensitiveRouteMatcher } from '../../helpers/caseInsensitiveRouteMatcher';

export const MobileModuleLazyRoutes = {
  matcher: caseInsensitiveRouteMatcher('mobile'),
  loadChildren: () => import('./mobile.module').then(m => m.MobileModule),
};
