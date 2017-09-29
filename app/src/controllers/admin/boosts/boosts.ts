import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs/Rx';

import { Client } from '../../../services/api';
import { RejectionReasonModalComponent } from './modal/rejection-reason-modal.component';
import { Reason, rejectionReasons } from './rejection-reasons';

@Component({
  moduleId: module.id,
  selector: 'minds-admin-boosts',
  host: {
    '(document:keypress)': 'onKeyPress($event)'
  },
  templateUrl: 'boosts.html'
})

export class AdminBoosts {

  boosts: Array<any> = [];
  type: string = 'newsfeed';
  count: number = 0;
  newsfeed_count: number = 0;
  content_count: number = 0;

  inProgress: boolean = false;
  moreData: boolean = true;
  offset: string = '';
  reasonModalOpened: boolean = false;

  statistics: any = null;
  selectedBoost: any = null;

  paramsSubscription: Subscription;

  @ViewChild('reasonModal') modal: RejectionReasonModalComponent;

  constructor(public client: Client, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.paramsSubscription = this.route.params.subscribe((params) => {
      if (params['type']) {
        this.type = params['type'];
      } else {
        this.type = 'newsfeed';
      }

      this.boosts = [];
      this.count = 0;
      this.inProgress = false;
      this.moreData = true;
      this.offset = '';

      this.load()
        .then(() => {
          this.loadStatistics();
        });
    });
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

  load() {
    if (this.inProgress)
      return;
    this.inProgress = true;

    return this.client.get('api/v1/admin/boosts/' + this.type, { limit: 24, offset: this.offset })
      .then((response: any) => {
        if (!response.boosts) {
          this.inProgress = false;
          this.moreData = false;
          return;
        }

        this.boosts = this.boosts.concat(response.boosts);
        this.count = response.count;
        this.newsfeed_count = response.newsfeed_count;
        this.content_count = response.content_count;

        this.offset = response['load-next'];
        this.inProgress = false;
      })
      .catch((e) => {
        this.inProgress = false;
      });
  }

  loadStatistics() {
    this.statistics = null;

    return this.client.get(`api/v1/admin/boosts/analytics/${this.type}`)
      .then((response) => {
        this.statistics = response;
      })
      .catch(e => {
        console.error('[Minds Admin] Cannot load boost statistics', e);
      });
  }

  accept(boost: any = null, open: boolean = false, opts: any = { mature: 0 }) {
    if (!boost)
      boost = this.boosts[0];

    boost.rating = open ? 2 : 1;

    if (!opts.mature)
      opts.mature = 0;

    this.client.post('api/v1/admin/boosts/' + this.type + '/' + boost.guid + '/accept', {
      quality: boost.quality,
      rating: boost.rating,
      mature: opts.mature
    });
    this.pop(boost);
  }

  reject(boost: any = null) {
    if (!boost)
      boost = this.boosts[0];

    this.reasonModalOpened = false;

    this.client.post('api/v1/admin/boosts/' + this.type + '/' + boost.guid + '/reject', { reason: boost.rejection_reason });
    this.pop(boost);
  }

  openReasonsModal(boost: any = null) {
    if (!boost)
      boost = this.boosts[0];

    this.reasonModalOpened = true;
    this.selectedBoost = boost;
  }

  eTag(boost: any = null) {
    if (!boost)
      boost = this.boosts[0];

    boost.rejection_reason = this.findReason('Explicit', 'label').code;

    this.reject(boost);
  }

  /**
   * Remove an entity from the list
   */
  pop(boost) {
    let i: any;
    for (i in this.boosts) {
      if (boost === this.boosts[i])
        this.boosts.splice(i, 1);
    }
    if (this.type === 'newsfeed')
      this.newsfeed_count--;
    else if (this.type === 'content')
      this.content_count--;
    if (this.boosts.length < 5)
      this.load();
  }

  onKeyPress(e: KeyboardEvent) {
    if (this.reasonModalOpened || e.ctrlKey || e.altKey || e.shiftKey) {
      return;
    }
    e.stopPropagation();

    // numbers
    if (e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode >= 96 && e.keyCode <= 105) {
      const keyValue = Number.parseInt(e.key);
      this.boosts[0].quality = keyValue > 0 ? keyValue * 10 : 100; // if we detect 0 then put 100%, else just multiply by 10
    }

    if (e.keyCode === 37)
      return this.accept();
    if (e.keyCode === 39)
      return this.openReasonsModal();

    switch (e.code) {
      case 'KeyE':
        //mark as nsfw and reject
        this.eTag(this.boosts[0]);
        break;
      case 'KeyN':
        //mark as nsfw and accept
        this.accept(this.boosts[0], true);
        break;
      case 'KeyA':
        this.accept();
        break;
      case 'KeyR':
        this.openReasonsModal();
        break;
    }
  }

  // TODO: Please, convert this to a pipe (and maybe add days support)!
  _duration(duration: number): string {
    const minsDuration = Math.floor(duration / (60000)),
      mins = minsDuration % 60,
      hours = Math.floor(minsDuration / 60);

    return `${hours}:${this._padStart('' + mins, 2, '0')}`;
  }

  findReason(value: any, field: 'code' | 'label' = 'code'): Reason {
    return rejectionReasons.find((item: Reason) => {
      return item[field] == value;
    });
  }

  private _padStart(str: string, targetLength, padString) {
    targetLength = targetLength >> 0; //floor if number or convert non-number to 0;
    padString = String(padString || ' ');
    if (str.length > targetLength) {
      return String(str);
    } else {
      targetLength = targetLength - str.length;
      if (targetLength > padString.length) {
        padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
      }
      return padString.slice(0, targetLength) + String(str);
    }
  }

}
