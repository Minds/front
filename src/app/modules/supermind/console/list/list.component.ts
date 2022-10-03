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
import { Supermind, SupermindConsoleListType } from '../../supermind.types';
import { SupermindConsoleService } from '../console.service';

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

  /** @var { BehaviorSubject<any[]> } list$ - list subject */
  public readonly list$: BehaviorSubject<any[]> = new BehaviorSubject<
    Supermind[]
  >([]);

  /** @var { number } requestLimit - number of Superminds to request from API */
  private readonly requestLimit: number = 12;

  constructor(private service: SupermindConsoleService) {
    super();
  }

  ngOnInit(): void {
    this.setupListTypeSubscription();
  }

  /**
   * Init sub to fire on list type change that will load / reload feed.
   * @return { void }
   */
  public setupListTypeSubscription(): void {
    this.subscriptions.push(
      // fires on list type change.
      this.listType$
        .pipe(
          distinctUntilChanged(),
          switchMap(
            (listType: SupermindConsoleListType): Observable<ApiResponse> => {
              this.list$.next([]);
              this.inProgress$.next(true);
              this.moreData$.next(!this.service.isNumericListType(listType));
              return this.service.getList$(this.requestLimit);
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
