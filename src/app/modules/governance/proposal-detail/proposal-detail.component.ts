import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SnapshotService, SnapshotProposal } from '../snapshot.service';
import * as moment from 'moment';
import { Remarkable } from 'remarkable';
import { linkify } from 'remarkable/linkify';

@Component({
  selector: 'm-governance--proposal-detail',
  templateUrl: 'proposal-detail.component.html',
})
export class GovernanceProposalDetailComponent implements OnInit {
  proposal: SnapshotProposal;
  inProgress = false;
  constructor(
    private readonly route: ActivatedRoute,
    private readonly snapshotService: SnapshotService
  ) {}

  ngOnInit() {
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
}
