import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { GroupsService } from '../../groups.service';
import { Session } from '../../../../services/session';
import { Router } from '@angular/router';
import { Client } from '../../../../services/api/client';
import { Subscription } from 'rxjs';
import { ToasterService } from '../../../../common/services/toaster.service';

/** Entity that actions can be performed against. */
type ActionableActivity = {
  guid: string;
  urn: string;
  activity_type?: string;
};

@Component({
  selector: 'm-groups-profile__review',
  templateUrl: 'review.component.html',
  styleUrls: ['./review.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupsProfileReviewComponent implements OnInit {
  group: any;
  group$: Subscription;

  entities: any[] = [];
  pinned: any[] = [];

  inProgress: boolean = false;
  moreData: boolean = true;
  offset: any = '';

  initialized: boolean = false;

  kicking: any;

  /**
   * Event emitter when a decision is made
   */
  @Output() newReviewCount: EventEmitter<number> = new EventEmitter<number>();

  constructor(
    protected service: GroupsService,
    protected session: Session,
    protected router: Router,
    protected client: Client,
    protected cd: ChangeDetectorRef,
    protected toasterService: ToasterService
  ) {}

  ngOnInit() {
    this.initialized = true;

    this.group$ = this.service.$group.subscribe(group => {
      this.group = group;
      this.load(true);
    });
  }

  async load(refresh: boolean = false) {
    if (!this.group) {
      return;
    }

    if (!refresh && this.inProgress) {
      return;
    }

    if (refresh) {
      this.entities = [];
      this.moreData = true;
      this.offset = '';
    }

    this.inProgress = true;

    this.detectChanges();

    try {
      const params: any = {
        limit: 12,
        offset: this.offset,
      };

      const response: any = await this.client.get(
        `api/v1/groups/review/${this.group.guid}`,
        params
      );

      if (typeof response['adminqueue:count'] !== 'undefined') {
        this.group['adminqueue:count'] = response['adminqueue:count'];
      }

      const entities = (response || {}).activity || [];
      const next = (response || {})['load-next'] || '';

      if (this.entities && !refresh) {
        this.entities.push(...entities);
      } else {
        this.entities = entities;
      }

      if (!next) {
        this.moreData = false;
      }

      this.offset = next;
    } catch (e) {
      console.error('GroupProfileFeedSortedComponent.loadReviewQueue', e);
    }

    this.inProgress = false;
    this.detectChanges();
  }

  delete(activity) {
    let i: any;

    for (i in this.entities) {
      if (this.entities[i] === activity) {
        this.entities.splice(i, 1);
        break;
      }
    }

    for (i in this.pinned) {
      if (this.pinned[i] === activity) {
        this.pinned.splice(i, 1);
        break;
      }
    }
  }

  async approve(activity, index: number) {
    if (!activity) {
      return;
    }

    this.entities.splice(index, 1);

    try {
      await this.client.put(
        `api/v1/groups/review/${
          this.group.guid
        }/${this.getActionableActivityGuid(activity)}`
      );

      this.group['adminqueue:count'] = this.group['adminqueue:count'] - 1;
      this.newReviewCount.emit(this.group['adminqueue:count']);
    } catch (e) {
      console.error(e);
      this.toasterService.error((e && e.message) || 'Internal server error');
    }
  }

  async reject(activity, index: number) {
    if (!activity) {
      return;
    }

    this.entities.splice(index, 1);

    try {
      await this.client.delete(
        `api/v1/groups/review/${
          this.group.guid
        }/${this.getActionableActivityGuid(activity)}`
      );

      this.group['adminqueue:count'] = this.group['adminqueue:count'] - 1;
      this.newReviewCount.emit(this.group['adminqueue:count']);
    } catch (e) {
      console.error(e);
      this.toasterService.error((e && e.message) || 'Internal server error');
    }
  }

  kick(user: any) {
    this.kicking = user;
  }

  //

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  /**
   * Gets the GUID for a given activity that properly references the entity that
   * actions should be performed against.
   * @param { ActionableActivity } activity - activity to get guid from.
   * @returns { string } guid of the entity to perform actions against.
   */
  private getActionableActivityGuid(activity: ActionableActivity): string {
    // If it's a remind, return the guid of remind its self, located in the URN.
    return activity.activity_type === 'remind' && activity.urn
      ? activity.urn.split(':')?.pop() ?? activity.guid
      : activity.guid;
  }
}
