import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';
import { ApiResponse } from '../../../../common/api/api.service';
import { AbstractSubscriberComponent } from '../../../../common/components/abstract-subscriber/abstract-subscriber.component';
import { Router } from '@angular/router';
import { ToasterService } from '../../../../common/services/toaster.service';
import {
  Boost,
  BoostConsoleLocationFilter,
  BoostConsolePaymentMethodFilter,
  BoostConsoleStateFilter,
  BoostConsoleSuitabilityFilter,
} from '../../boost.types';
import { BoostConsoleService } from '../services/console.service';

/**
 * Boost list component - contains logic for lists in the boost console
 */
@Component({
  selector: 'm-boostConsole__list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.ng.scss'],
})
export class BoostConsoleListComponent extends AbstractSubscriberComponent
  implements OnInit {
  // Whether request is in progress.
  public readonly inProgress$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  // Whether there is more data.
  public readonly moreData$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(true);

  // Boost console context subject.
  public readonly adminContext$: BehaviorSubject<boolean> = this.service
    .adminContext$;

  // State filter value subject.
  public readonly stateFilterValue$: BehaviorSubject<
    BoostConsoleStateFilter
  > = this.service.stateFilterValue$;

  // Location type e.g. newsfeed or sidebar.
  public readonly locationFilterValue$: BehaviorSubject<
    BoostConsoleLocationFilter
  > = this.service.locationFilterValue$;

  // Suitability filter value subject.
  public readonly suitabilityFilterValue$: BehaviorSubject<
    BoostConsoleSuitabilityFilter
  > = this.service.suitabilityFilterValue$;

  // Payment method filter value subject.
  public readonly paymentMethodFilterValue$: BehaviorSubject<
    BoostConsolePaymentMethodFilter
  > = this.service.paymentMethodFilterValue$;

  // List subject.
  public readonly list$: BehaviorSubject<any[]> = new BehaviorSubject<Boost[]>(
    []
  );

  // Number of boosts to request from API.
  private readonly requestLimit: number = 12;

  constructor(
    private service: BoostConsoleService,
    private router: Router,
    private toaster: ToasterService
  ) {
    super();
  }

  ngOnInit(): void {
    this.setupSubscription();
  }

  /**
   * Init sub to fire on tab or filter change that will load / reload feed.
   * @returns { void }
   */
  public setupSubscription(): void {
    this.subscriptions.push(this.load$().subscribe());
  }

  /**
   * Load feed.
   * @returns { Observable<ApiResponse> }
   */
  public load$(): Observable<ApiResponse> {
    return combineLatest([
      this.locationFilterValue$,
      this.stateFilterValue$,
      this.suitabilityFilterValue$,
      this.paymentMethodFilterValue$,
    ]).pipe(
      distinctUntilChanged(),
      tap(_ => {
        this.inProgress$.next(true);
        this.list$.next([]);
        // this.initialCount$.next(0);
      }),
      debounceTime(100),
      switchMap(
        ([
          locationFilterValue,
          stateFilterValue,
          suitabilityFilterValue,
          paymentMethodFilterValue,
        ]: [
          BoostConsoleLocationFilter,
          BoostConsoleStateFilter,
          BoostConsoleSuitabilityFilter,
          BoostConsolePaymentMethodFilter
        ]): Observable<ApiResponse> => {
          return this.service.getList$(this.requestLimit, 0);
        }
      ),
      tap((response: any) => {
        if (response && typeof response.redirect !== 'undefined') {
          console.log(response);
          this.toaster.error(response.errorMessage);
          this.router.navigate(['boost/console-v2']);
          return;
        }
        this.moreData$.next(response?.length >= this.requestLimit);
        this.inProgress$.next(false);
        console.log('ojm response', response);
        this.list$.next(response.boosts);
      })
    );
  }

  /**
   * Load more from service based on list type and list length for offset.
   * @return { void }
   */
  public loadNext(): void {
    if (this.inProgress$.getValue()) {
      return;
    }
    this.inProgress$.next(true);

    this.subscriptions.push(
      this.service
        .getList$(this.requestLimit, this.list$.getValue().length ?? null)
        .pipe(take(1))
        .subscribe((list: any) => {
          if (list && list.length) {
            let currentList = this.list$.getValue();
            this.list$.next([...currentList, ...list]);
          } else {
            this.moreData$.next(false);
          }
          this.inProgress$.next(false);
        })
    );
  }

  /**
   * Whether no boosts text should be shown.
   * @returns { Observable<boolean> } - true if no boosts text should be shown.
   */
  get shouldShowNoBoostsText$(): Observable<boolean> {
    return combineLatest([this.list$, this.inProgress$]).pipe(
      map(([list, inProgress]) => {
        return !inProgress && (!list || !list.length);
      })
    );
  }
}
