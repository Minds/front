import { Component, Input, OnInit } from '@angular/core';
import {
  SnapshotProposal,
  SnapshotService,
  SnapshotSpace,
} from '../snapshot.service';
import { switchMap } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';
import { PROPOSAL_CHOICE } from '../create/create.component';

@Component({
  selector: 'm-governance__card',
  templateUrl: './card.component.html',
})
export class GovernanceCardComponent implements OnInit {
  @Input() space: SnapshotSpace;
  @Input() proposal: SnapshotProposal;
  @Input() showHeader: boolean;

  isLong = false;
  accepted = 0;
  rejected = 100;

  constructor(private snapshotService: SnapshotService) {}

  ngOnInit() {
    this.checkLength(this.proposal.body);
    this.fetchVotes();
  }

  checkLength(text: string) {
    if (text.length > 360) {
      this.isLong = true;
    }
  }

  fetchVotes() {
    this.snapshotService
      .getVotes(this.proposal.id)
      .pipe(
        switchMap((votes) =>
          fromPromise(
            this.snapshotService.getResults(this.space, this.proposal, votes)
          )
        )
      )
      .subscribe((choices) => {
        const rejectChoice = choices.find((choice) =>
          ['no', PROPOSAL_CHOICE.REJECT].includes(choice.label.toLowerCase())
        );
        const rejectPercentage = rejectChoice ? rejectChoice.percentage : 1;
        this.rejected = Math.round(rejectPercentage);
        this.accepted = Math.round(100 - rejectPercentage);
      });
  }
}
