import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformServer } from '@angular/common';
import { SnapshotService, SnapshotSpace } from './snapshot.service';
import { shareReplay, tap } from 'rxjs/operators';

@Injectable()
export class GovernanceService {
  inProgress$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  error$: BehaviorSubject<string> = new BehaviorSubject('');
  hasMoreData$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  lastOffset = 0;
  space$ = this.snapshot.getMindsSpace().pipe(shareReplay(1));
  proposals$: BehaviorSubject<Array<any>> = new BehaviorSubject([]);

  constructor(
    private snapshot: SnapshotService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  async load(opts: {
    limit: number;
    refresh: boolean;
    type: string;
  }): Promise<void> {
    this.error$.next(null);
    this.inProgress$.next(true);

    if (isPlatformServer(this.platformId)) {
      return;
    }

    if (opts.refresh) {
      this.proposals$.next([]);
    }

    // Subscribe can not rely on next batch, so load further batch
    this.lastOffset = this.proposals$.getValue().length
      ? this.lastOffset + opts.limit
      : 0;

    this.snapshot
      .getMindsProposals({ skip: this.lastOffset, first: 12, state: opts.type })
      // .getMindsProposals({ skip: 0, first: 20 })
      .subscribe(
        (data) => {
          this.proposals$.next([
            ...this.proposals$.getValue(),
            ...data.proposals,
          ]);
          this.hasMoreData$.next(data.proposals.length >= opts.limit);
          this.error$.next('');
        },
        (err) => {
          this.proposals$.next(err.data);
        },
        () => this.inProgress$.next(false)
      );
  }

  reset() {
    this.proposals$.next([]);
    this.error$.next(null);
    this.hasMoreData$.next(false);
  }
}
