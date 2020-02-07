import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { Client } from '../../services/api';
import { Storage } from '../../services/storage';
import { Session } from '../../services/session';

export type HybridSearchEntities = {
  user: any[];
  group: any[];
  'object:video': any[];
  'object:image': any[];
  'object:blog': any[];
  activity: any[];
};

@Component({
  moduleId: module.id,
  selector: 'm-search',
  templateUrl: 'search.component.html',
  host: {
    '(window:click)': 'onWindowClick($event)',
  },
})
export class SearchComponent {
  q: string = '';
  type: string = '';
  container: string = '';

  searchType: 'hybrid' | 'simple';
  entities: any[];
  hybridEntities: HybridSearchEntities;

  offset: string = '';
  inProgress: boolean = false;
  moreData: boolean = true;

  optionsToggle: boolean = false;
  mature: boolean = false;
  paywall: boolean = true;
  rating: number = 2;

  paramsSubscription: Subscription;

  ref: string = '';

  constructor(
    public client: Client,
    public route: ActivatedRoute,
    private router: Router,
    private storage: Storage,
    private session: Session
  ) {
    if (!this.session.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
  }

  ngOnInit() {
    this.loadOptions();

    this.paramsSubscription = this.route.params.subscribe(params => {
      if (typeof params['q'] !== 'undefined') {
        this.q = decodeURIComponent(params['q'] || '');
      }

      if (typeof params['type'] !== 'undefined') {
        this.type = params['type'] || '';
      }

      if (typeof params['id'] !== 'undefined') {
        this.container = params['id'] || '';
      }

      if (typeof params['ref'] !== 'undefined') {
        this.ref = params['ref'] || '';
      }

      this.reset();
      this.inProgress = false;
      this.offset = '';

      this.search();
    });
  }

  ngOnDestroy() {
    if (this.paramsSubscription) this.paramsSubscription.unsubscribe();
  }

  /**
   * Search
   */
  async search(refresh: boolean = true) {
    if (this.inProgress && !refresh) {
      return;
    }

    this.inProgress = true;
    this.searchType = !this.type || this.type == 'latest' ? 'hybrid' : 'simple';

    if (refresh) {
      this.reset();
      this.offset = '';
      this.moreData = true;
    }

    try {
      let endpoint = 'api/v2/search',
        searchType = this.searchType;

      const data = {
        q: this.q,
        container: this.container || '',
        limit: 12,
        rating: this.rating,
        offset: this.offset,
      };

      if (searchType == 'hybrid') {
        endpoint = 'api/v2/search/top';
        data['sort'] = this.type;

        if (this.hasRef('hashtag')) {
          data['topLimits[user]'] = 2;
          data['topLimits[group]'] = 0;
        }
      } else {
        data['taxonomies'] = this.type;
      }

      if (!this.mature) {
        data['mature'] = 0;
      } else {
        data.rating = 3; // explicit is now rating 3
      }

      if (!this.paywall) {
        data['paywall'] = 0;
      }

      let response: any = await this.client.get(endpoint, data);

      if (refresh) {
        this.reset();
      }

      if (searchType == 'hybrid') {
        this.hybridEntitiesPush(response.entities);
      } else {
        this.entities.push(...(response.entities || []));
      }

      if (response['load-next']) {
        this.offset = response['load-next'];
      } else {
        this.moreData = false;
      }
    } catch (e) {
    } finally {
      this.inProgress = false;
    }
  }

  toggleOptions(forceValue?: boolean) {
    if (typeof forceValue !== 'undefined') {
      this.optionsToggle = forceValue;
      return;
    }

    this.optionsToggle = !this.optionsToggle;
  }

  toggleMature() {
    this.mature = !this.mature;
    this.search(true);

    this.saveOptions();
  }

  togglePaywall() {
    this.paywall = !this.paywall;
    this.search(true);

    this.saveOptions();
  }

  onWindowClick($event) {
    this.toggleOptions(false);
  }

  loadOptions() {
    const options = JSON.parse(this.storage.get('search:options') || '{}');

    if (typeof options['mature'] !== 'undefined') {
      this.mature = options['mature'];
    }

    if (typeof options['paywall'] !== 'undefined') {
      this.paywall = options['paywall'];
    }
  }

  saveOptions() {
    this.storage.set(
      'search:options',
      JSON.stringify({
        mature: this.mature,
        paywall: this.paywall,
      })
    );
  }

  hasRef(ref: string) {
    if (!this.ref) {
      return false;
    }

    const refs = this.ref.split('-');

    return refs.indexOf(ref) > -1;
  }

  onOptionsChange(opts) {
    this.rating = opts.rating;
    this.search(true);
  }

  protected reset() {
    this.entities = [];

    this.hybridEntities = {
      user: [],
      group: [],
      'object:video': [],
      'object:image': [],
      'object:blog': [],
      activity: [],
    };
  }

  protected hybridEntitiesPush(entities: HybridSearchEntities) {
    if (!entities) {
      return;
    }

    for (let key in this.hybridEntities) {
      if (typeof entities[key] !== 'undefined') {
        this.hybridEntities[key].push(...entities[key]);
      }
    }
  }
}
