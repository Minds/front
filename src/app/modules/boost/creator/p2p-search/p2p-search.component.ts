import { Component, Input, Output, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { Client } from '../../../../services/api/client';

type CurrencyType = 'points' | 'usd' | 'tokens';

@Component({
  providers: [ CurrencyPipe ],
  selector: 'm-boost--creator-p2p-search',
  templateUrl: 'p2p-search.component.html'
})
export class BoostCreatorP2PSearchComponent {

  @Input() boost;
  @Output() boostChanged: EventEmitter<any> = new EventEmitter();

  @Input() rates = {
    balance: null,
    rate: 1,
    min: 250,
    cap: 5000,
    usd: 1000,
    tokens: 1000,
    minUsd: 1,
    priority: 1,
    maxCategories: 3
  };

  query: string = '';
  results: any[] = [];
  searching: boolean = false;
  private throttle;

  @ViewChild('input') private input: ElementRef;

  constructor(
    private client: Client,
    private cd: ChangeDetectorRef,
  ) { }

  /**
   * Activates and sets focus on the target editor
   */
  onFocus() {
    this.searching = true;
    this.cd.detectChanges();

    if (this.input.nativeElement) {
      setTimeout(() => (<HTMLInputElement>this.input.nativeElement).focus(), 100);
    }
  }

  /**
   * Deactivates the target editor
   */
  onBlur() {
    this.searching = false;
  }

  /**
   * Searches the current target query on the server
   */
  search() {
    if (this.throttle) {
      clearTimeout(this.throttle);
      this.throttle = void 0;
    }

    if (this.query.charAt(0) !== '@') {
      this.query = '@' + this.query;
    }

    let query = this.query;
    if (query.charAt(0) === '@') {
      query = query.substr(1);
    }

    if (!query || query.length <= 2) {
      this.results = [];
      return;
    }

    this.throttle = setTimeout(() => {
      this.client.get(`api/v2/search/suggest/user`, {
        q: query,
        limit: 8,
        hydrate: 1
      })
        .then(({ entities }) => {
          if (!entities) {
            return;
          }

          this.results = entities;
        })
        .catch(e => console.error('Cannot load results', e));
    });
  }

  /**
   * Sets the current target for a P2P boost
   */
  setTarget(target, $event?) {
    if ($event) {
      $event.preventDefault();
    }

    this.boost.target = { ...target };
    this.results = [];
    this.query = '@' + target.username;
    this.boostChanged.emit(this.boost);
  }

  // Boost Pro
  togglePostToFacebook() {
    this.boost.postToFacebook = !this.boost.postToFacebook;
  }

}
