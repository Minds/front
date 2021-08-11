import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformServer } from '@angular/common';
import { SnapshotProposal, SnapshotService } from '../snapshot.service';

@Injectable()
export class GovernanceLatestService {
  proposals$: BehaviorSubject<SnapshotProposal[]> = new BehaviorSubject([]);
  totalProposals$: BehaviorSubject<number> = new BehaviorSubject(0);
  inProgress$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  error$: BehaviorSubject<string> = new BehaviorSubject('');

  constructor(
    private snapshot: SnapshotService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  async loadProposals(): Promise<void> {
    this.inProgress$.next(true);

    if (isPlatformServer(this.platformId)) {
      return;
    }

    this.proposals$.next([]);
    this.totalProposals$.next(0);
    this.error$.next('');

    this.snapshot
      .getProposals({ skip: 0, first: 20, state: 'active' })
      // .getMindsProposals({ skip: 0, first: 20 })
      .subscribe(
        proposals => {
          this.proposals$.next(proposals);
          this.totalProposals$.next(proposals.length);
          this.error$.next('');
        },
        err => {
          this.proposals$.next(err.data);
          this.totalProposals$.next(err.data.length);
        },
        () => this.inProgress$.next(false)
      );
  }
}
