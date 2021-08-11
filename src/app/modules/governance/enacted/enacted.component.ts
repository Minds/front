import { Component, OnInit } from '@angular/core';
import { SnapshotProposal, SnapshotService } from '../snapshot.service';
import { BehaviorSubject } from 'rxjs';
@Component({
  selector: 'm-governance--enacted',
  templateUrl: './enacted.component.html',
})
export class GovernanceEnactedComponent implements OnInit {
  proposals$: BehaviorSubject<SnapshotProposal[]> = new BehaviorSubject([]);
  totalProposals$: BehaviorSubject<number> = new BehaviorSubject(0);
  inProgress$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private snapshot: SnapshotService) {}

  ngOnInit() {
    this.inProgress$.next(true);
    this.snapshot
      .getProposals({ skip: 0, first: 20, state: 'closed' })
      .subscribe(
        proposals => {
          this.proposals$.next(proposals);
          this.totalProposals$.next(proposals.length);
        },
        () => {},
        () => this.inProgress$.next(false)
      );
  }
}
