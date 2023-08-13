import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { GroupService } from '../group.service';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  catchError,
  distinctUntilChanged,
  map,
  of,
  share,
  shareReplay,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { MindsGroup } from '../group.model';
import { SlowFadeAnimation } from '../../../../animations';
import { ConfigsService } from '../../../../common/services/configs.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Session } from '../../../../services/session';
import { GroupMembersListService } from '../members/list/list.service';
import { ApiResponse, ApiService } from '../../../../common/api/api.service';
import {
  GroupMembershipGetParams,
  GroupMembershipGetResponse,
} from '../group.types';

/**
 * Displays a couple avatars of group members and text that links to
 * the full list of users
 */
@Component({
  selector: 'm-group__memberPreviews',
  templateUrl: './member-previews.component.html',
  styleUrls: ['./member-previews.component.ng.scss'],
  animations: [SlowFadeAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupMemberPreviewsComponent implements OnInit, OnDestroy {
  group: MindsGroup;
  members: Array<any>;
  inProgress: boolean = false;
  count: number = 0;
  totalCount: number = 0;

  readonly cdnUrl: string;
  private readonly requestLimit = 5;

  constructor(
    private service: GroupService,
    private api: ApiService,
    private session: Session,
    private router: Router,
    private cd: ChangeDetectorRef,
    configs: ConfigsService
  ) {
    this.cdnUrl = configs.get('cdn_url');
  }

  /**
   * The max number of member avatars/usernames to show
   */
  protected maxMembersCount: number = 2;

  /** Value from service - what group are we talking about */
  public readonly group$: BehaviorSubject<MindsGroup> = this.service.group$;

  subscriptions: Subscription[] = [];

  /**
   * Load members list.
   * @returns { Observable<any[]>}
   */
  loadMembers$: Observable<any[]> = this.group$.pipe(
    take(1),
    switchMap(group => {
      this.inProgress = true;
      let endpoint = `api/v1/groups/membership/${group.guid}`;

      let params: GroupMembershipGetParams = {
        limit: this.requestLimit,
      };

      return this.api.get(endpoint, params);
    }),
    // on error.
    catchError(e => {
      console.error(e);
      return of([]);
    }),
    map((apiResponse: GroupMembershipGetResponse) => {
      if (apiResponse.members) {
        return apiResponse.members;
      } else {
        return null;
      }
    }),
    share()
  );

  ngOnInit(): void {
    this.subscriptions.push(
      this.service.memberCount$.pipe(take(1)).subscribe(count => {
        this.totalCount = count;
      }),
      this.loadMembers$.subscribe(members => {
        if (!members || !members.length) return;
        this.members = members;

        // hacky temp fix for displaying plural language
        // until we fix bug where members:count always returns 1
        if (this.members.length > this.totalCount) {
          this.totalCount = 2;
        }

        // Remove yourself from the previews.
        // You already know if you're in the group.
        let loggedInUserIndex;

        if (this.session.getLoggedInUser()) {
          loggedInUserIndex = this.members.findIndex(
            member => member.guid === this.session.getLoggedInUser().guid
          );

          if (loggedInUserIndex > -1) {
            this.members.splice(loggedInUserIndex, 1);
          }
        }

        // Make sure we only pass as many members
        // as we want to display in the userAggregator
        if (this.members.length > 0) {
          this.members = this.members.slice(0, this.maxMembersCount);
        }

        if (loggedInUserIndex > -1 && this.members.length === 1) {
          // If only you and one other person are members,
          // just show the other person's avatar
          this.maxMembersCount = 1;
        }

        this.inProgress = false;
        this.detectChanges();
      })
    );
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  /**
   * Navigate to members view on click
   * @param $event
   */
  onAggregatorClick($event): void {
    this.router.navigate(['group', this.group$.getValue().guid, 'members']);
  }

  /**
   * Run change detection.
   * @returns { void }
   */
  private detectChanges(): void {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
