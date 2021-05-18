import {
  Component,
  Input,
  ElementRef,
  ViewChild,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { Session } from '../../../services/session';
import { NotificationsV3Service } from './notifications-v3.service';

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

  constructor(
    public session: Session,
    private service: NotificationsV3Service,
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
  }

  ngOnDestroy() {
    this.listSubscription.unsubscribe();
    this.nextPagingTokenSubscription.unsubscribe();
  }

  loadNext(): void {
    this.service.loadNext(this.nextPagingToken);
  }

  setFilter(filter: string): void {
    this.list = [];
    this.service.requestListAt$.next(Date.now());
    this.nextPagingToken = '';
    this.service.pagingToken$.next('');
    this.filter$.next(filter);
  }
}
