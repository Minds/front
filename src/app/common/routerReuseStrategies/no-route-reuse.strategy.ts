import {
  ActivatedRouteSnapshot,
  BaseRouteReuseStrategy,
} from '@angular/router';
import * as _ from 'lodash';

/**
 * Strategy that allows the conditional setting of whether a component should be
 * reloaded on route change. This is useful if for example you want a component
 * to reload when a URL parameter changes.
 *
 * This should be provided as a RouteReuseStrategy to the module that your route is in
 * if not already loaded globally.
 * e.g.
 *
 * ```
 * { provide: RouteReuseStrategy, useClass: NoRouteReuseStrategy }
 * ```
 *
 * For any routes you want it to apply to, `reloadOnRouteChange` or `reloadOnParamChange`
 * should be added to the route data.
 */
export class NoRouteReuseStrategy extends BaseRouteReuseStrategy {
  /**
   * Whether route should be reused. To use, provide `reloadOnRouteChange` as true
   * in the route data of a route within a module where this strategy is used. e.g.
   *
   * ```
   * const routes: Routes = [{
   *    path: 'example/:param',
   *    component: ExampleComponent,
   *    data: { reloadOnRouteChange: true }
   * }];
   * ```
   *
   * alternatively you can provide `reloadOnParamChange`, to reload on parameter change only.
   *
   * @param { ActivatedRouteSnapshot } future - snapshot of future route.
   * @param { ActivatedRouteSnapshot } curr - snapshot of current route.
   * @returns { boolean }- true if route should be reused.
   */
  public shouldReuseRoute(
    future: ActivatedRouteSnapshot,
    curr: ActivatedRouteSnapshot
  ): boolean {
    if (future.data.reloadOnParamChange) {
      return _.isEqual(future.params, curr.params);
    }

    return future.routeConfig === curr.routeConfig
      ? !future.data.reloadOnRouteChange
      : false;
  }
}
