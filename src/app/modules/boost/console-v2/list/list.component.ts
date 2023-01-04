import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
  take,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { ApiResponse } from '../../../../common/api/api.service';
import { AbstractSubscriberComponent } from '../../../../common/components/abstract-subscriber/abstract-subscriber.component';
import { Router } from '@angular/router';
import { ToasterService } from '../../../../common/services/toaster.service';
import {
  Boost,
  BoostConsoleLocationFilterType,
  BoostState,
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

  // Location type e.g. newsfeed or sidebar.
  public readonly locationFilterValue$: BehaviorSubject<
    BoostConsoleLocationFilterType
  > = this.service.locationFilterValue$;

  // State filter value subject.
  public readonly stateFilterValue$: BehaviorSubject<
    BoostState
  > = new BehaviorSubject<BoostState>(null); // ojm why not 'all'?

  // List subject.
  public readonly list$: BehaviorSubject<any[]> = new BehaviorSubject<Boost[]>(
    []
  );

  // Number of boosts to request from API.
  private readonly requestLimit: number = 12;

  // // First count of all entries.
  // public readonly initialCount$: BehaviorSubject<number> = new BehaviorSubject<
  //   number
  // >(0);

  // // Latest updated count of all entries.
  // public readonly updatedCount$: BehaviorSubject<number> = new BehaviorSubject<
  //   number
  // >(0);

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
    ]).pipe(
      distinctUntilChanged(),
      tap(_ => {
        this.inProgress$.next(true);
        this.list$.next([]);
        // this.initialCount$.next(0);
      }),
      debounceTime(100),
      switchMap(
        ([locationFilterValue, stateFilterValue]: [
          BoostConsoleLocationFilterType,
          BoostState
        ]): Observable<ApiResponse> => {
          this.moreData$.next(!this.service.isNumericListType(listType));
          return this.service.getList$(this.requestLimit, 0, stateFilterValue);
        }
      ),
      tap((response: any) => {
        if (response && typeof response.redirect !== 'undefined') {
          console.log(response);
          this.toaster.error(response.errorMessage);
          this.router.navigate(['boost/inbox']);
          return;
        }
        this.moreData$.next(response?.length >= this.requestLimit);
        this.inProgress$.next(false);
        this.list$.next(response);
        this.populateCounts();
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
        .getList$(
          this.requestLimit,
          this.list$.getValue().length ?? null,
          this.stateFilterValue$.getValue()
        )
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
   * Get a count of all entries a user could have from the server
   * and populate instance variables with values.
   * @returns { void }
   */
  // public populateCounts(): void {
  //   this.subscriptions.push(
  //     this.stateFilterValue$
  //       .pipe(
  //         // only call once.
  //         take(1),
  //         // switch the stream to be the actual count request and call it with the state parameter.
  //         switchMap(state => this.service.countAll$(state)),
  //         // include initial count so we can check if it is set.
  //         withLatestFrom(this.initialCount$)
  //       )
  //       .subscribe(([newCount, initialCount]: [number, number]) => {
  //         // if there is no initial count - set it.
  //         if (!initialCount) {
  //           this.initialCount$.next(newCount);
  //         }
  //         // else just set the updated count.
  //         this.updatedCount$.next(newCount);
  //       })
  //   );
  // }

  /**
   * Called on state filter change.
   * @param { BoostState } stateFilterValue - state of boost changed to by filter.
   * @returns { void }
   */
  public onStateFilterChange(stateFilterValue: BoostState): void {
    this.stateFilterValue$.next(stateFilterValue);
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
