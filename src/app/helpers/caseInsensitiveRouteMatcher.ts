import { UrlMatchResult, UrlSegment } from '@angular/router';

/**
 * To be used with simple paths where the route should be
 * catched independently of beign uppercase or lowercase
 * export const SomeModuleLazyRoutes = {
 *    matcher: caseInsensitiveRouteMatcher('pathinlowercase'),
 *    loadChildren: () => import('./someModule.module').then(m => m.SomeModuleModule),
 * };
 * @param route path
 * @returns consumed url or null
 */
export const caseInsensitiveRouteMatcher = (path: string) => {
  return (url: UrlSegment[]): UrlMatchResult | null =>
    url.some((urlSegment: UrlSegment) => urlSegment.path.toLowerCase() === path)
      ? {
          consumed: url.map(urlSegment => ({
            ...urlSegment,
            path: urlSegment.path.toLowerCase(),
          } as UrlSegment)),
        }
      : null;
};
