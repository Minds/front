import { Client } from '../api/client.service';
import { BehaviorSubject } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { RedirectService } from './redirect.service';
import { Location } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ConfigsService {
  private configs = {};
  public isReady$ = new BehaviorSubject(false);

  constructor(
    private client: Client,
    @Inject('QUERY_STRING') private queryString: string,
    private redirectService: RedirectService,
    private location: Location
  ) {}

  async loadFromRemote() {
    try {
      this.configs = await this.client.get(
        `api/v1/minds/config${this.queryString}`
      );
      this.isReady$.next(true);
      this.redirectToRootIfInvalidDomain();
    } catch (err) {
      if (err.status === 404) {
        throw `Invalid domain. Site not found`;
      }
      console.error(err);
    }
  }

  get<T = any>(key): T | null {
    return (this.configs[key] as T) || null;
  }

  set(key, value): void {
    this.configs[key] = value;
  }

  /**
   * Redirect to the root domain if we have an invalid domain response from configs
   * @return void
   */
  private redirectToRootIfInvalidDomain(): void {
    if (this.get('redirect_to_root_on_init') === true) {
      const redirectTo: string =
        this.get('site_url') + this.location.path().substr(1);
      this.redirectService.redirect(redirectTo);
      throw `Invalid domain. Redirecting to ${redirectTo}`;
    }
  }
}
