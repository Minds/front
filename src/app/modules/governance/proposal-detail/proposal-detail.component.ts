import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  SnapshotProposal,
  SnapshotService,
  SnapshotSpace,
  SnapshotVote,
} from '../snapshot.service';
import * as moment from 'moment';
import { Remarkable } from 'remarkable';
import { linkify } from 'remarkable/linkify';
import { BehaviorSubject } from 'rxjs';
import { SettingsV2Service } from '../../settings-v2/settings-v2.service';
import { Session } from '../../../services/session';

interface Choice {
  value: string;
  balance: number;
}

@Component({
  selector: 'm-governance--proposal-detail',
  templateUrl: 'proposal-detail.component.html',
})
export class GovernanceProposalDetailComponent implements OnInit {
  proposal: SnapshotProposal;
  space: SnapshotSpace;
  inProgress = false;
  userData;
  allowDelete = true;
  votes$ = new BehaviorSubject<SnapshotVote[]>([]);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly snapshotService: SnapshotService,
    private settingsV2Service: SettingsV2Service,
    public session: Session
  ) {}

  async ngOnInit() {
    this.route.params.subscribe((params) => {
      const proposalId = params['id'];
      this.inProgress = true;
      this.snapshotService.getProposal({ id: proposalId }).subscribe((res) => {
        this.proposal = res.proposal;
        this.space = res.space;

        this.proposal.start = moment(this.proposal.start * 1000).format('lll');
        this.proposal.end = moment(this.proposal.end * 1000).format('lll');

        const md = new Remarkable({ breaks: true });
        this.proposal.body = md.use(linkify).render(this.proposal.body);

        this.inProgress = false;
        this.validateUser();

        this.votes$.next(res.votes);
      });
    });
  }

  truncatedOnchainAddress(address: string): string {
    if (!address) {
      return '';
    }
    return address.substr(0, 4) + '...' + address.substr(-4);
  }

  openSnapshot(snapshotId: string) {
    return window
      .open(
        `https://snapshot.org/#/${this.proposal.space.id}/proposal/${snapshotId}`,
        '_blank'
      )
      .focus();
  }

  async validateUser() {
    this.userData = await this.settingsV2Service.loadSettings(
      this.session.getLoggedInUser().guid
    );
    if (this.userData.eth_wallet !== this.proposal.author) {
      this.allowDelete = false;
    }
  }
}
