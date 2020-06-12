import { Injectable, isDevMode } from '@angular/core';
import { Session } from './session';
import { Router } from '@angular/router';
import { ConfigsService } from '../common/services/configs.service';
import { Subscription, Observable } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable()
export class FeaturesService {
  protected _warnedCache: { [key: string]: number } = {};
  private features = {};

  constructor(private session: Session, public configs: ConfigsService) {}

  has(feature: string): boolean {
    const features = this.configs.get('features');

    if (!features) return false;

    if (!feature) {
      throw new Error('Invalid feature ID');
    }
    if (feature.indexOf('!') === 0) {
      // Inverted check. Useful for *mIfFeature
      return !this.has(feature.substring(1));
    }

    if (typeof features[feature] === 'undefined') {
      if (isDevMode() && !this._hasWarned(feature)) {
        this._warnedCache[feature] = Date.now();
      }

      return false;
    }

    if (features[feature] === 'admin' && this.session.isAdmin()) {
      return true;
    }

    if (
      features[feature] === 'canary' &&
      this.session.getLoggedInUser().canary
    ) {
      return true;
    }

    return features[feature] === true;
  }

  protected _hasWarned(feature: string) {
    if (!this._warnedCache[feature]) {
      return false;
    }

    // Once every 5s
    return this._warnedCache[feature] + 5000 < Date.now();
  }

  static _(session: Session, configs: ConfigsService) {
    return new FeaturesService(session, configs);
  }
}
