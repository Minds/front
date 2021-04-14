import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Client } from '../../../services/api';
import { Session } from '../../../services/session';

@Component({
  selector: 'm-groupsMemberships',
  templateUrl: './memberships.component.html',
  styleUrls: ['./memberships.component.ng.scss'],
})
export class GroupsMembershipsComponent implements OnInit {
  inProgress: boolean = false;
  groups = [];
  offset = 0;
  moreData: boolean = true;
  readonly cdnUrl: string;
  menuOpened$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private client: Client, public session: Session) {}
  ngOnInit(): void {
    this.load(true);
  }
  async load(refresh: boolean = false): Promise<void> {
    if (this.inProgress || !this.session.getLoggedInUser()) {
      return;
    }
    this.inProgress = true;
    try {
      const response: any = await this.client.get('api/v1/groups/member', {
        offset: this.offset,
        limit: 1,
      });
      if (!response.entities && this.offset) {
        this.moreData = false;
        throw 'No entities found';
      }
      if (refresh) {
        this.groups = response.entities;
      } else {
        this.groups = this.groups.concat(response.entities);
      }
      this.offset = response['load-next'];
      this.moreData = response.entities && response.entities.length;
    } catch (e) {
    } finally {
      this.inProgress = false;
    }
  }
}
