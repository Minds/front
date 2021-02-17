import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigsService } from '../../../common/services/configs.service';
import { LazyComponent } from '../../../common/services/modal-lazy-load.service';
import {
  BoostModalService,
  BoostSubject,
  BoostTab,
} from './boost-modal.service';

@Component({
  selector: 'm-boostModal',
  templateUrl: './boost-modal.component.html',
  styleUrls: ['./boost-modal.component.ng.scss'],
})
export class BoostModalComponent implements OnDestroy, OnInit, LazyComponent {
  private subscriptions: Subscription[] = [];

  public cdnAssetsUrl: string;

  constructor(private service: BoostModalService, configs: ConfigsService) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }

  ngOnInit(): void {
    // this.subscriptions.push(
    // );
  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  /**
   * Subject from service
   */
  get subject$(): BehaviorSubject<BoostSubject> {
    return this.service.subject$;
  }

  /**
   * inProgress from service
   */
  get inProgress$(): BehaviorSubject<boolean> {
    return this.service.inProgress$;
  }

  /**
   * disabled from service
   */
  get disabled$(): BehaviorSubject<boolean> {
    return this.service.disabled$;
  }

  /**
   * active tab from service.
   */
  get activeTab$(): BehaviorSubject<BoostTab> {
    return this.service.activeTab$;
  }

  /**
   * Dismiss intent.
   */
  onDismissIntent: () => void = () => {};

  /**
   * Save intent.
   */
  onSaveIntent: () => void = () => {};

  /**
   * Sets modal options.
   * @param onDismissIntent - set dismiss intent callback.
   */
  set opts({ subject, onDismissIntent, onSaveIntent }) {
    this.onDismissIntent = onDismissIntent || (() => {});
    this.onSaveIntent = onSaveIntent || (() => {});
    this.service.subject$.next(subject || '');
  }

  /**
   * Observable containing CSS object for banner src -
   * if none present makes height shorter.
   * @returns { Observable<object> } - css object intended for consumption by an ngStyle.
   */
  get bannerSrc(): { backgroundImage: string } {
    return {
      backgroundImage: `url('${this.cdnAssetsUrl}assets/photos/galaxy.jpg')`,
    };
  }
}
