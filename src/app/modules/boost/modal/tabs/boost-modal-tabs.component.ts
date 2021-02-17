import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  BoostModalService,
  BoostSubject,
  BoostTab,
} from '../boost-modal.service';

@Component({
  selector: 'm-boostModal__tabs',
  templateUrl: './boost-modal-tabs.component.html',
  styleUrls: ['./boost-modal-tabs.component.ng.scss'],
})
export class BoostModalTabsComponent implements OnDestroy, OnInit {
  private subscriptions: Subscription[] = [];

  constructor(private service: BoostModalService) {}

  ngOnInit(): void {
    // this.subscriptions.push(
    // );
  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  get showTabs$(): Observable<boolean> {
    return this.service.subject$.pipe(map(subject => subject === 'post'));
  }

  get activeTab$(): BehaviorSubject<BoostTab> {
    return this.service.activeTab$;
  }

  get subject$(): BehaviorSubject<BoostSubject> {
    return this.service.subject$;
  }

  public nextTab(tab: BoostTab): void {
    this.activeTab$.next(tab);
  }
}
