import { Component } from '@angular/core';
import { Client } from '../../../services/api/client';
import { GroupsService } from '../../groups/groups-service';
import { Session } from '../../../services/session';
import { ConfigsService } from '../../../common/services/configs.service';

@Component({
  selector: 'm-suggestions__sidebarGroups',
  templateUrl: 'sidebar.component.html',
})
export class GroupSuggestionsSidebarComponent {
  readonly cdnUrl: string;
  lastOffset: number = 0;

  entities: Array<any> = [];
  inProgress: boolean = false;

  constructor(
    private client: Client,
    public session: Session,
    public service: GroupsService,
    configs: ConfigsService
  ) {
    this.cdnUrl = configs.get('cdn_url');
  }

  ngOnInit() {
    this.load();
  }

  async load() {
    let limit = 5;

    if (this.entities.length) limit = 1;

    this.lastOffset = this.entities.length ? this.lastOffset + 11 : 0;

    this.inProgress = true;
    try {
      const response: any = await this.client.get(
        'api/v2/entities/suggested/groups/all',
        {
          limit,
          offset: this.lastOffset,
        }
      );

      for (let entity of response.entities) {
        this.entities.push(entity);
      }
    } catch (e) {
      console.error(e);
    }
    this.inProgress = false;
  }

  remove(entity) {
    this.entities.splice(this.entities.indexOf(entity), 1);
  }

  // group section

  /**
   * Check if the group is closed
   */
  isPublic(group: any) {
    if (group.membership !== 2) return false;
    return true;
  }

  /**
   * Join a group
   */
  join(group: any) {
    this.inProgress = true;
    this.service
      .join(group)
      .then(() => {
        this.inProgress = false;
        if (this.isPublic(group)) {
          group['is:member'] = true;
          return;
        }
        group['is:awaiting'] = true;
      })
      .catch(e => {
        let error = e.error;
        switch (e.error) {
          case 'You are banned from this group':
            error = 'banned';
            break;
          case 'User is already a member':
            error = 'already_a_member';
            break;
          default:
            error = e.error;
            break;
        }
        group['is:member'] = false;
        group['is:awaiting'] = false;
        this.inProgress = false;
      });
  }

  /**
   * Leave a group
   */
  leave(group) {
    this.service
      .leave(group)
      .then(() => {
        group['is:member'] = false;
      })
      .catch(e => {
        group['is:member'] = true;
      });
  }

  /**
   * Cancel a group joining request
   */
  cancelRequest(group: any) {
    group['is:awaiting'] = false;

    this.service.cancelRequest(group).then((done: boolean) => {
      group['is:awaiting'] = !done;
    });
  }
}
