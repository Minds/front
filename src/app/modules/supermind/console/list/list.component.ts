import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import {
  distinctUntilChanged,
  map,
  switchMap,
  take,
  tap,
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
  /** @var { BehaviorSubject<boolean >} inProgress$ - whether request is in progress */
  public readonly inProgress$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  /** @var { BehaviorSubject<boolean> } moreData$ - whether there is more data */
  public moreData$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    true
  );

  /** @var { BehaviorSubject<SupermindConsoleListType> } listType$ - list type e.g. inbox or outbox */
  public readonly listType$: BehaviorSubject<SupermindConsoleListType> = this
    .service.listType$;

  /** @var { BehaviorSubject<SupermindState> } statusFilterValue$ - status filter value subject */
  public readonly statusFilterValue$: BehaviorSubject<
    SupermindState
  > = new BehaviorSubject<SupermindState>(null);

  /** @var { BehaviorSubject<any[]> } list$ - list subject */
  public readonly list$: BehaviorSubject<any[]> = new BehaviorSubject<
    Supermind[]
  >([]);

  /** @var { Observable<boolean> } isSingleSupermindPage$ - true if this is a single supermind page */
  public readonly isSingleSupermindPage$: Observable<boolean> = this.service
    .isSingleSupermindPage$;

  /** @var { number } requestLimit - number of Superminds to request from API */
  private readonly requestLimit: number = 12;

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
    this.subscriptions.push(
      combineLatest([this.listType$, this.statusFilterValue$])
        .pipe(
          distinctUntilChanged(),
          switchMap(
            ([listType, statusFilterValue]: [
              SupermindConsoleListType,
              SupermindState
            ]): Observable<ApiResponse> => {
              this.list$.next([]);
              this.inProgress$.next(true);
              this.moreData$.next(!this.service.isNumericListType(listType));
              return this.service.getList$(
                this.requestLimit,
                0,
                statusFilterValue
              );
            }
          ),
          tap((list: any) => {
            this.moreData$.next(list.length >= this.requestLimit);
            this.inProgress$.next(false);
            this.list$.next(list);
          })
        )
        .subscribe()
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
