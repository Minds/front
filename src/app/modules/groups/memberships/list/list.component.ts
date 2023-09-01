import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  combineLatest,
  distinctUntilChanged,
  map,
  shareReplay,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { GroupsMembershipsListService } from './list.service';
import { GroupMembershipLevel } from '../../v2/group.types';
import { Session } from '../../../../services/session';
import { ApiResponse } from '../../../../common/api/api.service';

/**
 * Presents a list of groups the user is associated with
 */
@Component({
  selector: 'm-groupsMemberships__list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.ng.scss'],
  providers: [GroupsMembershipsListService],
})
export class GroupsMembershipsListComponent implements OnInit, OnDestroy {
  /**
   * Allows us to use enum in the template
   */
  public groupMembershipLevel: typeof GroupMembershipLevel = GroupMembershipLevel;

  // Whether request is in progress.
  public readonly inProgress$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  // Whether there is more data that could be added to the list.
  public readonly moreData$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(true);

  // List subject.
  public readonly list$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(
    []
  );

  /**
   * If true, use infinite scroll to load more.
   * If false, use a manual "show more" button.
   */
  @Input() useInfiniteScroll: boolean = true;

  /**
   * The size of the list we want to retrieve
   */
  @Input() requestLimit: number = 12;

  /**
   * Which membership level do we want to see in the list
   */
  @Input() membershipLevel: GroupMembershipLevel = GroupMembershipLevel.MEMBER;

  /**
   * Whether to show all levels above the specified level as well
   */
  @Input() membershipLevelGte: boolean = false;

  /**
   * Optional title
   */
  @Input() listTitle: string;

  /**
   * Whether the user is a member of any groups
   */
  @Output() hasGroups: EventEmitter<boolean> = new EventEmitter<boolean>(false);

  /**
   * Whether the list load is in progress
   */
  @Output() inProgress: EventEmitter<boolean> = new EventEmitter<boolean>(
    false
  );

  /**
   * Whether the list has loaded
   */
  @Output() loaded: EventEmitter<boolean> = new EventEmitter<boolean>(false);

  private subscriptions: Subscription[] = [];

  private loadSubscription: Subscription;

  /** Via service - which membership level do we want to present? */
  public readonly groupMembershipLevel$: BehaviorSubject<
    GroupMembershipLevel
  > = this.service.groupMembershipLevel$;

  /** Via service - whether to show all levels above the specified level as well */
  public readonly membershipLevelGte$: BehaviorSubject<boolean> = this.service
    .membershipLevelGte$;

  constructor(
    private service: GroupsMembershipsListService,
    protected session: Session
  ) {}

  ngOnInit(): void {
    if (!this.session.getLoggedInUser()) return;
    this.service.membershipLevelGte$.next(this.membershipLevelGte);
    this.service.groupMembershipLevel$.next(this.membershipLevel);

    this.setupSubscriptions();
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }

    this.loadSubscription?.unsubscribe();
  }
  /**
   * Init sub to fire on tab or filter change that will load / reload feed.
   * @returns { void }
   */
  public setupSubscriptions(): void {
    this.loadSubscription = this.load$().subscribe();
  }

  /**
   * Load groups list.
   * @returns { Observable<ApiResponse> }
   */
  public load$(): Observable<
    ApiResponse | { redirect: boolean; errorMessage: any }
  > {
    return this.groupMembershipLevel$.pipe(
      distinctUntilChanged(),
      tap(_ => {
        this.inProgress$.next(true);
        this.list$.next([]);
      }),
      switchMap(
        (
          groupMembershipLevel: GroupMembershipLevel
        ): Observable<
          ApiResponse | { redirect: boolean; errorMessage: any }
        > => {
          return this.service.getList$(this.requestLimit, 0);
        }
      ),
      tap((response: any) => {
        this.moreData$.next(response['load-next']);
        this.inProgress$.next(false);
        this.list$.next(response.groups);
        if (response.groups && response.groups.length) {
          this.hasGroups.emit(true);
        } else {
          this.hasGroups.emit(false);
        }
        this.inProgress.emit(false);
        this.loaded.emit(true);
      }),
      shareReplay()
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
        .subscribe((response: any) => {
          if (response && response.groups && response.groups.length) {
            let currentList = this.list$.getValue();
            this.list$.next([...currentList, ...response.groups]);

            this.moreData$.next(response['load-next']);
          } else {
            this.moreData$.next(false);
          }
          this.inProgress$.next(false);
        })
    );
  }

  /**
   * @returns { Observable<boolean> } - true if we tried to load the list and didn't get any responses
   */
  get listIsEmpty$(): Observable<boolean> {
    return combineLatest([this.list$, this.inProgress$]).pipe(
      map(([list, inProgress]) => {
        return !inProgress && (!list || !list.length);
      })
    );
  }
}
