import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SnapshotService, SnapshotProposal } from '../snapshot.service';

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
        this.proposal.body = this.formatDescription(this.proposal.body);
        this.proposal.body = this.formatTitle(this.proposal.body);

        console.log(this.proposal.body);
        this.inProgress = false;
      });
    });
  }

  formatDescription(value: string): string {
    value = (value || '').trim();
    const position = value.indexOf(`##`);
    if (position > 0) {
      value = value.slice(0, position).trim();
    }

    return value;
  }

  formatTitle(value: string) {
    const position = value.split('\n');
    console.log(position);
    return value;
  }
}
