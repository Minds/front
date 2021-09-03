import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  SnapshotChoice,
  SnapshotProposal,
  SnapshotService,
  SnapshotSpace,
  SnapshotVote,
} from '../../snapshot.service';
import { BehaviorSubject } from 'rxjs';
import {
  debounceTime,
  map,
  share,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';

// Only allow single-choice voting

@Component({
  selector: 'm-voting-card',
  templateUrl: './voting-card.component.html',
  styleUrls: ['./voting-card.component.scss'],
})
export class VotingCardComponent implements OnInit {
  @Input() proposal: SnapshotProposal;
  @Input() space: SnapshotSpace;
  @Input() votes: SnapshotVote[];

  @Output() vote = new EventEmitter<SnapshotChoice>();

  loading$ = new BehaviorSubject(false);

  votes$ = new BehaviorSubject([]);

  choices$ = this.votes$.pipe(
    debounceTime(500),
    tap(() => this.loading$.next(true)),
    switchMap((votes) =>
      fromPromise(
        this.snapshotService.getResults(this.space, this.proposal, votes)
      )
    ),
    tap(() => this.loading$.next(false)),
    shareReplay(1)
  );
  choicesButtons$ = this.choices$.pipe(
    map((choices) => [...choices].sort((a, b) => a.position - b.position))
  );

  constructor(private snapshotService: SnapshotService) {}

  ngOnInit(): void {
    this.votes$.next(this.votes);
  }

  fetchVotes() {
    this.snapshotService.getVotes(this.proposal.id).subscribe((votes) => {
      this.votes$.next(votes);
    });
  }

  async handleVoting(choice: SnapshotChoice) {
    try {
      this.loading$.next(true);
      await this.snapshotService.vote(this.proposal, choice.position);
      this.fetchVotes();
    } catch (e) {
      console.warn('error', e);
    } finally {
      this.loading$.next(false);
    }
  }

  formatVotes(votes: number): string {
    const digits = Math.floor(Math.log10(votes));
    if (digits >= 6) {
      return this.formatDigits(votes, 6) + 'M';
    }
    if (digits >= 3) {
      return this.formatDigits(votes, 3) + 'K';
    }
    return this.formatDigits(votes, 0);
  }

  private formatDigits(votes: number, expo: number) {
    const value = (votes / 10 ** expo).toFixed(2);
    return value.replace(/.00$/, '');
  }
}
