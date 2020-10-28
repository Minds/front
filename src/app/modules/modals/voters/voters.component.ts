import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { ConfigsService } from '../../../common/services/configs.service';
import VotersModalService from './service';

@Component({
  selector: 'm-modal-voters',
  templateUrl: 'voters.component.html',
})
export default class VotersModalComponent implements OnInit, OnDestroy {
  open: boolean = false;
  totalVotes = 0;
  voters = [];
  title: string;
  isOpenSubscription: Subscription;
  titleSubscription: Subscription;
  votersSubscription: Subscription;
  totalVotesSubscription: Subscription;

  constructor(
    private configs: ConfigsService,
    public service: VotersModalService
  ) {}

  public ngOnInit() {
    this.isOpenSubscription = this.service.isOpen$.subscribe(open => {
      this.open = open;
    });
    this.titleSubscription = this.service.title$.subscribe(title => {
      this.title = title;
    });
    this.votersSubscription = this.service.voters$.subscribe(voters => {
      this.voters = voters;
    });
    this.totalVotesSubscription = this.service.totalVoters$.subscribe(
      totalVotes => {
        this.totalVotes = totalVotes;
      }
    );
  }

  public ngOnDestroy() {
    this.isOpenSubscription.unsubscribe();
    this.titleSubscription.unsubscribe();
    this.votersSubscription.unsubscribe();
    this.totalVotesSubscription.unsubscribe();
  }

  close() {
    this.service.close();
  }

  onClose(e: boolean) {
    this.close();
  }

  getAvatarUrl(guid: string, iconTime: string): string {
    return this.configs.get('cdn_url') + 'icon/' + guid + '/small/' + iconTime;
  }

  get moreCount(): string {
    if (this.voters.length < this.totalVotes) {
      // TODO: translate
      return `+ ${this.totalVotes - this.voters.length} more`;
    }

    return '';
  }
}
