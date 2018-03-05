import { Injectable, isDevMode } from '@angular/core';
import { Session } from './session';
import { Router } from '@angular/router';

@Injectable()
export class FeaturesService {
  protected _features: any;

  constructor(private session: Session, private router: Router) {
    this._features = window.Minds.features || {};
  }

  static _(session: Session, router: Router) {
    return new FeaturesService(session, router);
  }

  has(feature: string) {
    if (typeof this._features[feature] === 'undefined') {
      if (isDevMode()) {
        console.warn(`[FeaturedService] Feature '${feature}' is not declared. Assuming true.`);
      }

      return true;
    }

    if (this._features[feature] === 'admin' && this.session.isAdmin()) {
      return true;
    }

    return this._features[feature] === true;
  }

  check(feature: string, { redirectTo }: { redirectTo?: any[] } = {}) {
    const has = this.has(feature);

    if (!has && redirectTo) {
      this.router.navigate(redirectTo, { replaceUrl: true });
    }

    return has;
  }
}
