import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnDestroy,
  OnInit,
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
import { GroupMembersListService } from './list.service';
import { ApiResponse } from '../../../../../common/api/api.service';
import { GroupMembershipLevel } from '../../group.types';
import { MindsGroup } from '../../group.model';
import { Session } from '../../../../../services/session';

/**
 * Presents a list of group members
 */
@Component({
  selector: 'm-group__membersList',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.ng.scss'],
  providers: [GroupMembersListService],
})
export class GroupMembersListComponent implements OnInit, OnDestroy {
  // Whether request is in progress.
  public readonly inProgress$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  // Whether there is more data that could be added to the list.
  public readonly moreData$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(true);

  // List subject.
  public readonly list$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(
    []
  );

  /** Value from service - what group are we talking about */
  public readonly group$: BehaviorSubject<MindsGroup> = this.service.group$;

  /** Value from service - which membership level do we want to present? */
  public readonly groupMembershipLevel$: BehaviorSubject<GroupMembershipLevel> =
    this.service.groupMembershipLevel$;

  /** Value from service - whether to show all levels above the specified level as well */
  public readonly membershipLevelGte$: BehaviorSubject<boolean> =
    this.service.membershipLevelGte$;

  /** Value from service - search for a specific user */
  public readonly searchQuery$: BehaviorSubject<string> =
    this.service.searchQuery$;

  // Number of members to request from API.
  private readonly requestLimit: number = 12;

  private subscriptions: Subscription[] = [];

  /**
   * Search query input
   */
  protected query: string = '';

  /**
   * The group we want to know about
   */
  @Input() group: MindsGroup;

  /**
   * Which membership level do we want to see in the list
   */
  @Input() membershipLevel: GroupMembershipLevel = GroupMembershipLevel.MEMBER;

  @Input() membershipLevelGte: boolean = false;

  /**
   * Whether to show the search bar
   */
  @Input() showSearch: boolean = false;

  /**
   * Show list in compact format
   * with a manual "see more" button
   * instead of infinite scroll
   * (e.g. for moderators list)
   */
  @Input() compactView: boolean = false;

  /**
   * Show badges next to owners names
   * (only relevant for compact view)
   */
  @Input() showOwnerBadges: boolean = true;

  /**
   * Optional title
   */
  @Input() listTitle: string;

  /**
   * Reload the list if member changed elsewhere
   */
  @Input() set sync(member: any) {
    if (member) {
      this.loadSubscription?.unsubscribe();
      this.loadSubscription = this.load$().subscribe();
    }
  }

  /**
   * Emit when members and/or their roles have changed
   */
  @Output() memberChanged: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Emit when list has been loaded. Used to sync the members
   * list with the moderators list and vice versa
   */
  @Output() loaded: EventEmitter<any> = new EventEmitter<any>();

  private loadSubscription: Subscription;

  constructor(
    private service: GroupMembersListService,
    protected session: Session
  ) {}

  ngOnInit(): void {
    this.service.group$.next(this.group);
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
   * Load members list.
   * @returns { Observable<ApiResponse> }
   */
  public load$(): Observable<
    ApiResponse | { redirect: boolean; errorMessage: any }
  > {
    return combineLatest([
      this.group$,
      this.groupMembershipLevel$,
      this.membershipLevelGte$,
      this.searchQuery$,
    ]).pipe(
      distinctUntilChanged(),
      tap((_) => {
        this.inProgress$.next(true);
        this.list$.next([]);
      }),
      switchMap(
        ([group, groupMembershipLevel, membershipLevelGte, q]: [
          MindsGroup,
          GroupMembershipLevel,
          boolean,
          string,
        ]): Observable<
          ApiResponse | { redirect: boolean; errorMessage: any }
        > => {
          //this.service.searchQuery$.next(q);
          return this.service.getList$(this.requestLimit, 0);
        }
      ),
      tap((response: any) => {
        this.inProgress$.next(false);
        this.list$.next(response.members);
        this.moreData$.next(this.getMoreDataValue(response));
        this.loaded.emit();
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
          if (response && response.members && response.members.length) {
            let currentList = this.list$.getValue();
            this.list$.next([...currentList, ...response.members]);

            this.moreData$.next(this.getMoreDataValue(response));
          } else {
            this.moreData$.next(false);
          }
          this.inProgress$.next(false);
        })
    );
  }

  /**
   * Search for a specific member
   */
  search(): void {
    this.service.searchQuery$.next(this.query);
  }

  /**
   * Called when a user is removed from the group by a moderator
   * @param member
   */
  onKick(member) {
    const prunedList = this.list$
      .getValue()
      .filter((e) => e.guid !== member.guid);

    this.list$.next(prunedList);
  }

  /**
   * Whether no members text should be shown.
   * @returns { Observable<boolean> } - true if no members are found
   */
  get shouldShowNoMembersText$(): Observable<boolean> {
    return combineLatest([this.list$, this.inProgress$]).pipe(
      map(([list, inProgress]) => {
        return !inProgress && (!list || !list.length);
      })
    );
  }

  /**
   * Whether group member actions should be shown.
   * @param { unknown } member - member to check.
   * @returns { boolean } - true if group member actions should be shown.
   */
  public shouldShowGroupMemberActions(member: unknown): boolean {
    return (
      this.group['is:owner'] ||
      (this.group['is:moderator'] &&
        !(member['is:owner'] || member['is:moderator']))
    );
  }

  /**
   * Reduces likelihood of needlessly showing
   * a manual "see more" button
   * in the moderators list.
   * Response total is unreliable - shows entire group count
   * @param response
   */
  private getMoreDataValue(response): boolean {
    if (this.compactView) {
      return (
        // Only true if the response has maxed out the limit
        response.members.length >= this.requestLimit &&
        // and there aren't theoretically more members to load
        response.total > this.list$.getValue().length
      );
    } else {
      return response['load-next'];
    }
  }
}
