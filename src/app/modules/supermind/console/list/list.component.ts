import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import {
  distinctUntilChanged,
  map,
  switchMap,
  take,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { ApiResponse } from '../../../../common/api/api.service';
import { AbstractSubscriberComponent } from '../../../../common/components/abstract-subscriber/abstract-subscriber.component';
import {
  Supermind,
  SupermindConsoleListType,
  SupermindState,
} from '../../supermind.types';
import { SupermindConsoleService } from '../services/console.service';

/**
 * Supermind list component - contains logic for inbox / outbox list.
 */
@Component({
  selector: 'm-supermind__list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.ng.scss'],
})
export class SupermindConsoleListComponent extends AbstractSubscriberComponent
  implements OnInit {
  // Whether request is in progress.
  public readonly inProgress$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  // Whether there is more data.
  public readonly moreData$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(true);

  // List type e.g. inbox or outbox.
  public readonly listType$: BehaviorSubject<SupermindConsoleListType> = this
    .service.listType$;

  // Status filter value subject.
  public readonly statusFilterValue$: BehaviorSubject<
    SupermindState
  > = new BehaviorSubject<SupermindState>(null);

  // List subject.
  public readonly list$: BehaviorSubject<any[]> = new BehaviorSubject<
    Supermind[]
  >([]);

  // True if this is a single supermind page.
  public readonly isSingleSupermindPage$: Observable<boolean> = this.service
    .isSingleSupermindPage$;

  // Number of Superminds to request from API.
  private readonly requestLimit: number = 12;

  // First count of all entries.
  public readonly initialCount$: BehaviorSubject<number> = new BehaviorSubject<
    number
  >(0);

  // Latest updated count of all entries.
  public readonly updatedCount$: BehaviorSubject<number> = new BehaviorSubject<
    number
  >(0);

  // Count of new Superminds.
  public readonly newCount$: Observable<number> = combineLatest([
    this.initialCount$,
    this.updatedCount$,
  ]).pipe(
    map(([initialCount, updatedCount]: [number, number]): number => {
      if (!initialCount) {
        return 0;
      }
      return updatedCount - initialCount;
    })
  );

  constructor(private service: SupermindConsoleService) {
    super();
  }

  ngOnInit(): void {
    this.setupSubscription();
  }

  /**
   * Init sub to fire on list type or filter change that will load / reload feed.
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
    return combineLatest([this.listType$, this.statusFilterValue$]).pipe(
      distinctUntilChanged(),
      switchMap(
        ([listType, statusFilterValue]: [
          SupermindConsoleListType,
          SupermindState
        ]): Observable<ApiResponse> => {
          this.list$.next([]);
          this.initialCount$.next(0);
          this.inProgress$.next(true);
          this.moreData$.next(!this.service.isNumericListType(listType));
          return this.service.getList$(this.requestLimit, 0, statusFilterValue);
        }
      ),
      tap((list: any) => {
        this.moreData$.next(list.length >= this.requestLimit);
        this.inProgress$.next(false);
        this.list$.next(list);
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
          this.statusFilterValue$.getValue()
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
  public populateCounts(): void {
    this.subscriptions.push(
      this.statusFilterValue$
        .pipe(
          // only call once.
          take(1),
          // switch the stream to be the actual count request and call it with the status parameter.
          switchMap(status => this.service.countAll$(status)),
          // include initial count so we can check if it is set.
          withLatestFrom(this.initialCount$)
        )
        .subscribe(([newCount, initialCount]: [number, number]) => {
          // if there is no initial count - set it.
          if (!initialCount) {
            this.initialCount$.next(newCount);
          }
          // else just set the updated count.
          this.updatedCount$.next(newCount);
        })
    );
  }

  /**
   * Called on see latest click. Reset the feed, scroll to top and reload.
   * @returns { void }
   */
  public onSeeLatestClick(): void {
    this.inProgress$.next(true);
    this.list$.next([]);
    window.scrollTo({
      behavior: 'smooth',
      top: 0,
    });
    this.subscriptions.push(
      this.load$()
        .pipe(take(1))
        .subscribe()
    );
  }

  /**
   * Called on status filter change.
   * @param { SupermindState } statusFilterValue - state of supermind changed to by filter.
   * @returns { void }
   */
  public onStatusFilterChange(statusFilterValue: SupermindState): void {
    this.statusFilterValue$.next(statusFilterValue);
  }

  /**
   * Whether no offers text should be shown.
   * @returns { Observable<boolean> } - true if no offers text should be shown.
   */
  get shouldShowNoOffersText$(): Observable<boolean> {
    return combineLatest([this.list$, this.inProgress$]).pipe(
      map(([list, inProgress]) => {
        return !inProgress && (!list || !list.length);
      })
    );
  }
}
