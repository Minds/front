import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import snapshot from '@snapshot-labs/snapshot.js';
import { Web3WalletService } from '../blockchain/web3-wallet.service';
import { votingStrategies } from '../../helpers/voting';

const SNAPSHOT_GRAPHQL_URL = 'https://hub.snapshot.org/graphql';
const SNAPSHOT_SCORE_API = 'https://score.snapshot.org/api/scores';
const MINDS_SPACE = 'weenus';
// const MINDS_SPACE = 'mind.eth';

export type ProposalType =
  | 'single-choice'
  | 'approval'
  | 'quadratic'
  | 'ranked-choice'
  | 'weighted';

export interface SnapshotProposal {
  id: string;
  title: string;
  type: ProposalType;
  body: string;
  choices: string[];
  start: any;
  end: any;
  snapshot: string;
  state: string;
  author: string;
  space: {
    id: string;
    name: string;
  };
  strategies: {
    name: string;
    params: any;
  }[];
  // proposal?: SnapshotProposal;
}

export interface SnapshotProposalWithSpace extends SnapshotProposal {
  space: SnapshotSpace;
}

interface SnapshotStrategy {
  name: string;
  params: Record<string, unknown>;
}

interface CreateProposal {
  name: string;
  body: string;
  choices: string[];
  start: number;
  end: number;
  snapshot: number;
  type?: ProposalType;
  metadata?: {
    plugins?: Record<string, unknown>;
    network?: string;
    strategies?: SnapshotStrategy[];
  };
}

interface CreateProposalResponse {
  id: string;
}

interface GetProposalsVariables {
  first: number;
  skip: number;
  space?: string;
  state?: string;
}

export interface SnapshotSpace {
  id: string;
  name: string;
  network: string;
  strategies: SnapshotStrategy[];
}

export interface SnapshotVote {
  id: string;
  voter: string;
  choice: number;
}

export interface SnapshotChoice {
  position: number;
  label: string;
  votes: number;
  percentage: number;
}

const PROPOSAL_FRAGMENT = `
fragment proposal on Proposal {
  id
  title
  body
  choices
  start
  end
  snapshot
  type
  state
  author
  space {
    id
    name
  }
}
`;

const SPACE_FRAGMENT = `
fragment space on Space {
  id
  name
  network
  strategies {
    name
    params
  }
}
`;

const QUERY_GET_PROPOSAL_LIST = `
query ($first: Int!, $skip: Int!, $space: String, $state: String) {
  proposals(first: $first, skip: $skip, where: {state: $state, space: $space}, orderBy: "created", orderDirection: desc) {
    ...proposal
  }
}
${PROPOSAL_FRAGMENT}
`;

const QUERY_GET_PROPOSAL = `
query ($id: String) {
  proposal(id: $id) {
    ...proposal
    strategies {
      name
      params
    }
    space {
      ...space
    }
  }
  votes(first: 10000, where: { proposal: $id }) {
    id
    voter
    choice
  }
}
${PROPOSAL_FRAGMENT}
${SPACE_FRAGMENT}
`;

const QUERY_VOTES = `
query ($id: String!) {
  votes(first: 10000, where: { proposal: $id }) {
    id
    voter
    choice
  }
}
`;

const QUERY_GET_SPACE = `
query ($id: String!) {
  space(id: $id) {
    ...space
  }
}
${SPACE_FRAGMENT}`;

interface CreateProposalParam extends Partial<CreateProposal> {
  name: CreateProposal['name'];
  body: CreateProposal['body'];
  start: CreateProposal['start'];
  end: CreateProposal['end'];
  choices: CreateProposal['choices'];
}

@Injectable()
export class SnapshotService {
  private snapshotClient = new snapshot.Client();

  constructor(
    protected web3Wallet: Web3WalletService,
    private httpClient: HttpClient
  ) {}

  getProposals(variables: GetProposalsVariables) {
    return this.execQuery<{ proposals: SnapshotProposal[] }>(
      QUERY_GET_PROPOSAL_LIST,
      variables as any
    ).pipe(map((response) => response));
  }

  getProposal(id: any) {
    return this.execQuery<{
      proposal: SnapshotProposalWithSpace;
      votes: SnapshotVote[];
    }>(QUERY_GET_PROPOSAL, id as any).pipe(
      map((response) => ({
        ...response,
        space: response.proposal.space,
      }))
    );
  }

  getVotes(id: any) {
    return this.execQuery<{
      votes: SnapshotVote[];
    }>(QUERY_VOTES, { id }).pipe(map((response) => response.votes));
  }

  getMindsProposals(variables: GetProposalsVariables) {
    return this.getProposals({ ...variables, space: MINDS_SPACE });
  }

  async createProposal(proposal: CreateProposalParam) {
    const provider = await this.web3Wallet.initializeProvider();
    if (provider) {
      const space = await this.getMindsSpace().toPromise();
      const signer = this.web3Wallet.getSigner();
      const address = await signer.getAddress();
      const blockNumber = await snapshot.utils.getBlockNumber(provider);

      const proposalPayload: CreateProposal = {
        type: 'single-choice',
        snapshot: blockNumber,
        ...proposal,
        metadata: {
          network: space.network,
          strategies: space.strategies,
          ...proposal.metadata,
        },
      };

      return (await this.snapshotClient.proposal(
        provider,
        address,
        MINDS_SPACE,
        proposalPayload
      )) as CreateProposalResponse;
    }
  }

  async deleteProposal(proposal) {
    const provider = await this.web3Wallet.initializeProvider();

    if (provider) {
      const signer = this.web3Wallet.getSigner();
      const address = await signer.getAddress();

      return await this.snapshotClient.deleteProposal(
        provider,
        address,
        MINDS_SPACE,
        { proposal: proposal.id }
      );
    }
  }

  getSpace(id: string) {
    return this.execQuery<{ space: SnapshotSpace }>(QUERY_GET_SPACE, {
      id,
    }).pipe(map((response) => response.space));
  }

  getMindsSpace() {
    return this.getSpace(MINDS_SPACE);
  }

  async getResults(
    space: SnapshotSpace,
    proposal: SnapshotProposal,
    votes: SnapshotVote[]
  ): Promise<SnapshotChoice[]> {
    const strategies = proposal.strategies ?? space.strategies;
    const scores = await this.fetchScores(space, proposal, votes).toPromise();

    votes = votes
      .map((vote: any) => {
        vote.scores = strategies.map(
          (strategy, i) => scores[i][vote.voter] || 0
        );
        vote.balance = vote.scores.reduce((a, b: any) => a + b, 0);
        return vote;
      })
      .sort((a, b) => b.balance - a.balance)
      .filter((vote) => vote.balance > 0);

    const votingClass = new votingStrategies[proposal.type](
      proposal,
      votes,
      strategies
    );
    const choicesVotes = votingClass.resultsByVoteBalance();
    const total = votingClass.sumOfResultsBalance();

    return proposal.choices
      .map((choice, i) => ({
        position: i + 1,
        label: choice,
        votes: choicesVotes[i],
        percentage: total ? (choicesVotes[i] / total) * 100 : 0,
      }))
      .sort((a, b) => b.votes - a.votes);
  }

  async vote(proposal: SnapshotProposal, choice: number) {
    const provider = await this.web3Wallet.initializeProvider();
    if (provider) {
      const signer = this.web3Wallet.getSigner();
      const address = await signer.getAddress();

      return await this.snapshotClient.vote(provider, address, MINDS_SPACE, {
        proposal: proposal.id,
        choice,
        metadata: {},
      });
    }
  }

  private execQuery<T>(query: string, variables?: Record<string, unknown>) {
    return this.httpClient
      .post<{ data: T }>(SNAPSHOT_GRAPHQL_URL, {
        query,
        variables,
      })
      .pipe(map((response) => response.data));
  }

  private fetchScores(
    space: SnapshotSpace,
    proposal: SnapshotProposal,
    votes: SnapshotVote[]
  ) {
    const params = {
      space: space.id,
      network: space.network,
      snapshot: parseInt(proposal.snapshot, 10),
      strategies: space.strategies,
      addresses: votes.map((vote) => vote.voter),
    };
    return this.httpClient
      .post<{ result: { scores: Record<string, number>[] } }>(
        SNAPSHOT_SCORE_API,
        { params }
      )
      .pipe(map((response) => response.result.scores));
  }
}
