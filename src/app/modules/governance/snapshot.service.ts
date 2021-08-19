import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import snapshot from '@snapshot-labs/snapshot.js';
import { Web3WalletService } from '../blockchain/web3-wallet.service';

const SNAPSHOT_GRAPHQL_URL = 'https://hub.snapshot.org/graphql';
const MINDS_SPACE = 'weenus';

type ProposalType =
  | 'single-choice'
  | 'approval'
  | 'quadratic'
  | 'ranked-choice'
  | 'weighted';

export interface SnapshotProposal {
  id: string;
  title: string;
  body: string;
  choices: string[];
  start: number;
  end: number;
  snapshot: string;
  state: string;
  author: string;
  space: {
    id: number;
    name: string;
  };
  proposal?: SnapshotProposal;
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
  area: number;

  type?: ProposalType;
  metadata?: {
    plugins?: Record<string, unknown>;
    network?: string;
    strategies?: SnapshotStrategy[];
  };
}

interface GetProposalsVariables {
  first: number;
  skip: number;
  space?: string;
  state?: string;
}

interface Space {
  id: string;
  name: string;
  network: string;
  strategies: SnapshotStrategy[];
}

const QUERY_GET_PROPOSAL_LIST = `
query ($first: Int!, $skip: Int!, $space: String, $state: String) {
  proposals(first: $first, skip: $skip, where: {state: $state, space: $space}, orderBy: "created", orderDirection: desc) {
    id
    title
    body
    choices
    start
    end
    snapshot
    state
    author
    space {
      id
      name
    }
  }
}`;

const QUERY_GET_PROPOSAL = `
query ($id: String) {
  proposal(id: $id) {
    id
    title
    body
    choices
    start
    end
    snapshot
    state
    author
    space {
      id
      name
    }
  }
}`;

const QUERY_GET_SPACE = `
query ($id: String!) {
  space(id: $id) {
    id
    name
    network
    strategies {
      name
      params
    }
  }
}`;

interface CreateProposalParam extends Partial<CreateProposal> {
  name: CreateProposal['name'];
  body: CreateProposal['body'];
  start: CreateProposal['start'];
  end: CreateProposal['end'];
  area: CreateProposal['area'];
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
    ).pipe(map(response => response));
  }

  getProposal(id: any) {
    return this.execQuery<{ proposal: SnapshotProposal }>(
      QUERY_GET_PROPOSAL,
      id as any
    ).pipe(map(response => response.proposal));
  }

  getMindsProposals(variables: GetProposalsVariables) {
    return this.getProposals({ ...variables, space: MINDS_SPACE });
  }

  async createProposal(proposal: CreateProposalParam) {
    await this.web3Wallet.initializeProvider();
    const provider = this.web3Wallet.provider;
    if (provider) {
      const space = await this.getSpace(MINDS_SPACE).toPromise();
      const signer = this.web3Wallet.getSigner();
      const address = await signer.getAddress();
      const blockNumber = await snapshot.utils.getBlockNumber(provider);

      const proposalPayload: CreateProposal = {
        type: 'single-choice',
        choices: ['approve', 'reject'],
        snapshot: blockNumber,
        ...proposal,
        metadata: {
          network: space.network,
          strategies: space.strategies,
          ...proposal.metadata,
        },
      };

      return await this.snapshotClient.proposal(
        provider,
        address,
        MINDS_SPACE,
        proposalPayload
      );
    }
  }

  getSpace(id: string) {
    return this.execQuery<{ space: Space }>(QUERY_GET_SPACE, { id }).pipe(
      map(response => response.space)
    );
  }

  private execQuery<T>(query: string, variables?: Record<string, unknown>) {
    return this.httpClient
      .post<{ data: T }>(SNAPSHOT_GRAPHQL_URL, {
        query,
        variables,
      })
      .pipe(map(response => response.data));
  }
}
