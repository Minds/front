import {
  SnapshotProposal,
  SnapshotVote,
} from '../../modules/governance/snapshot.service';

export abstract class VotingStrategy {
  public proposal: SnapshotProposal;
  public votes;
  public strategies;

  constructor(
    proposal: SnapshotProposal,
    votes: SnapshotVote[],
    strategies: any[]
  ) {
    this.proposal = proposal;
    this.votes = votes;
    this.strategies = strategies;
  }

  abstract resultsByVoteBalance(): number[];

  abstract resultsByStrategyScore(): number[][];

  abstract sumOfResultsBalance(): number;
}
