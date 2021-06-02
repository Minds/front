import {
  Component,
  Input,
  ElementRef,
  OnInit,
  OnDestroy,
  HostBinding,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { Session } from '../../../services/session';
import { NotificationService } from '../notification.service';
import {
  NotificationsV3Service,
  Notification,
} from './notifications-v3.service';

@Component({
  selector: 'm-notifications__list',
  templateUrl: 'list.component.html',
  styleUrls: ['./list.component.ng.scss'],
  providers: [NotificationsV3Service],
})
export class NotificationsV3ListComponent implements OnInit, OnDestroy {
  filter$ = this.service.filter$;
  list$ = this.service.list$;
  inProgress$ = this.service.inProgress$;

  nextPagingToken$ = this.service.nextPagingToken$;
  nextPagingToken: string;
  nextPagingTokenSubscription: Subscription;

  listSubscription: Subscription;
  list = [];

  @Input() scrollSource: boolean;

  @HostBinding('class.m-notifications__list--scrolledPastTabs')
  _scrolledPastTabs: boolean = false;

  @Input() set scrolledPastTabs(value: boolean) {
    this._scrolledPastTabs = value;
  }

  constructor(
    public session: Session,
    private service: NotificationsV3Service,
    public v1Service: NotificationService,
    public route: ActivatedRoute,
    public el: ElementRef
  ) {}

  ngOnInit() {
    this.listSubscription = this.list$.subscribe(list => {
      this.list = list;
    });

    this.nextPagingTokenSubscription = this.nextPagingToken$.subscribe(
      nextPagingToken => (this.nextPagingToken = nextPagingToken)
    );

    this.resetCounter();
  }

  /**
   * Cleanup subscriptions
   */
  ngOnDestroy() {
    this.listSubscription.unsubscribe();
    this.nextPagingTokenSubscription.unsubscribe();
  }

  /**
   * Load from the next paging token
   */
  loadNext(): void {
    this.service.loadNext(this.nextPagingToken);
  }

  /**
   * Set the filter ('' is all, 'tags' is mentions)
   * @param filter
   */
  setFilter(filter: string): void {
    this.list = [];
    this.service.requestListAt$.next(Date.now());
    this.nextPagingToken = '';
    this.service.pagingToken$.next('');
    this.filter$.next(filter);

    // Reset the counter too
    this.resetCounter();
  }

  reload($event): void {
    this.setFilter('');
  }

  /**
   * Resets the topbar counter
   */
  protected resetCounter(): void {
    this.v1Service.clear();
  }
}
