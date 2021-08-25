import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SnapshotService, SnapshotProposal } from '../snapshot.service';
import * as moment from 'moment';
import { Remarkable } from 'remarkable';
import { linkify } from 'remarkable/linkify';
import { SettingsV2Service } from '../../settings-v2/settings-v2.service';
import { Session } from '../../../services/session';

@Component({
  selector: 'm-governance--proposal-detail',
  templateUrl: 'proposal-detail.component.html',
})
export class GovernanceProposalDetailComponent implements OnInit {
  proposal: SnapshotProposal;
  inProgress = false;
  userData;
  allowDelete = true;
  constructor(
    private readonly route: ActivatedRoute,
    private readonly snapshotService: SnapshotService,
    private settingsV2Service: SettingsV2Service,
    public session: Session
  ) { }

  async ngOnInit() {
    this.route.params.subscribe(params => {
      const proposalId = params['id'];
      this.inProgress = true;
      this.snapshotService.getProposal({ id: proposalId }).subscribe(res => {
        this.proposal = res;
        this.proposal.start = moment(this.proposal.start * 1000).format('lll');
        this.proposal.end = moment(this.proposal.end * 1000).format('lll');
        var md = new Remarkable({
          breaks: true,
        });
        this.proposal.body = md.use(linkify).render(this.proposal.body);
        this.inProgress = false;
        this.validateUser();
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
      .open(`https://snapshot.org/#/weenus/proposal/${snapshotId}`, '_blank')
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
