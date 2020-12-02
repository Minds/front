import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { Client } from '../../../services/api';
import { RejectionReasonModalComponent } from './modal/rejection-reason-modal.component';
import { Reason, rejectionReasons } from '../../boost/rejection-reasons';
import { ReportCreatorComponent } from '../../report/creator/creator.component';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { ActivityService } from '../../../common/services/activity.service';

type TransactionId = {
  transaction_id: string | { hash: string };
};

@Component({
  moduleId: module.id,
  selector: 'minds-admin-boosts',
  host: {
    '(document:keypress)': 'onKeyPress($event)',
  },
  templateUrl: 'boosts.html',
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

  readonly NON_REPORTABLE_REASONS = [7, 8, 12, 13]; // spam, appeals, onchain payment failed, original post removed

  @ViewChild('reasonModal')
  modal: RejectionReasonModalComponent;

  constructor(
    public client: Client,
    private overlayModal: OverlayModalService,
    private route: ActivatedRoute,
    protected activityService: ActivityService
  ) {}

  ngOnInit() {
    this.paramsSubscription = this.route.params.subscribe(params => {
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

      this.load().then(() => {
        this.loadStatistics();
      });
    });
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

  load() {
    if (this.inProgress) return;
    this.inProgress = true;

    return this.client
      .get('api/v1/admin/boosts/' + this.type, {
        limit: 24,
        offset: this.offset,
      })
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
      .catch(e => {
        this.inProgress = false;
      });
  }

  loadStatistics() {
    this.statistics = null;

    return this.client
      .get(`api/v1/admin/boosts/analytics/${this.type}`)
      .then(response => {
        this.statistics = response;
      })
      .catch(e => {
        console.error('[Minds Admin] Cannot load boost statistics', e);
      });
  }

  accept(boost: any = null, open: boolean = false, opts: any = { mature: 0 }) {
    if (!boost) boost = this.boosts[0];

    boost.rating = open ? 2 : 1;

    if (!opts.mature) opts.mature = 0;

    this.client.post(
      'api/v1/admin/boosts/' + this.type + '/' + boost.guid + '/accept',
      {
        quality: boost.quality,
        rating: boost.rating,
        mature: opts.mature,
      }
    );
    this.pop(boost);
  }

  reject(boost: any = null) {
    if (!boost) boost = this.boosts[0];

    this.reasonModalOpened = false;

    if (this.NON_REPORTABLE_REASONS.indexOf(boost.rejection_reason) === -1) {
      this.report(this.selectedBoost);
    }

    this.client.post(
      'api/v1/admin/boosts/' + this.type + '/' + boost.guid + '/reject',
      { reason: boost.rejection_reason }
    );
    this.pop(boost);
  }

  openReasonsModal(boost: any = null) {
    if (!boost) boost = this.boosts[0];

    this.reasonModalOpened = true;
    this.selectedBoost = boost;
  }

  eTag(boost: any = null) {
    if (!boost) boost = this.boosts[0];

    boost.rejection_reason = this.findReason('Explicit', 'label').code;

    this.reject(boost);
  }

  report(boost: any = null) {
    if (!boost) {
      boost = this.boosts[0];
    }

    this.overlayModal.create(ReportCreatorComponent, boost.entity).present();
  }

  /**
   * Remove an entity from the list
   */
  pop(boost) {
    let i: any;
    for (i in this.boosts) {
      if (boost === this.boosts[i]) this.boosts.splice(i, 1);
    }
    if (this.type === 'newsfeed') this.newsfeed_count--;
    else if (this.type === 'content') this.content_count--;
    if (this.boosts.length < 5) this.load();
  }

  onKeyPress(e: KeyboardEvent) {
    //If an input is focused, disregard.
    if (document.activeElement.tagName === 'INPUT') {
      return;
    }
    e.stopPropagation();

    // numbers
    switch (e.key.toLowerCase()) {
      case 'n':
        //mark as nsfw and accept
        this.accept(this.boosts[0], true);
        break;
      case 'a':
        this.accept();
        break;
    }
  }

  // TODO: Please, convert this to a pipe (and maybe add days support)!
  _duration(duration: number): string {
    const minsDuration = Math.floor(duration / 60000),
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

  /**
   * Gets hash from a given boost
   * @param { TransactionId } - An object containing transaction_id, that contains
   *    either a string of the hash or an object containing a hash property.
   * @returns { string } - transaction_id as string.
   */
  public getHash({ transaction_id }: TransactionId): string {
    try {
      if (typeof transaction_id === 'object') {
        return transaction_id.hash;
      } else if (typeof transaction_id === 'string') {
        return transaction_id;
      }
      throw new Error(
        'Error in admin boosts, transaction_id is neither a string nor an object.'
      );
    } catch (e) {
      console.error(e);
      return '';
    }
  }
}
