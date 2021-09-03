import { SingleChoiceVoting } from './single-choice';
import { QuadraticVoting } from './quadratic';
import { RankedChoiceVoting } from './ranked-choice';
import { WeightedVoting } from './weighted';
import {
  ProposalType,
  SnapshotProposal,
  SnapshotVote,
} from '../../modules/governance/snapshot.service';
import { ApprovalVoting } from './approval';
import { VotingStrategy } from './voting-strategy';

export const votingStrategies: Record<
  ProposalType,
  new (
    proposal: SnapshotProposal,
    votes: SnapshotVote[],
    strategies: any[]
  ) => VotingStrategy
> = {
  'single-choice': SingleChoiceVoting,
  approval: ApprovalVoting,
  quadratic: QuadraticVoting,
  'ranked-choice': RankedChoiceVoting,
  weighted: WeightedVoting,
};
