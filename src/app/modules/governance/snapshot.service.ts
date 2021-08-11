import { Injectable, NgZone } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

const SNAPSHOT_GRAPHQL_URL = 'https://hub.snapshot.page/graphql';

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
}

interface GetProposalsVariables {
  first: number;
  skip: number;
  space?: string;
  state?: string;
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

@Injectable()
export class SnapshotService {
  constructor(private httpClient: HttpClient) {}

  static _(httpClient: HttpClient): SnapshotService {
    return new SnapshotService(httpClient);
  }

  getProposals(variables: GetProposalsVariables) {
    return this.execQuery<{ proposals: SnapshotProposal[] }>(
      QUERY_GET_PROPOSAL_LIST,
      variables as any
    ).pipe(map(response => response.proposals));
  }

  getMindsProposals(variables: GetProposalsVariables) {
    return this.getProposals({ ...variables, space: 'mind.eth' });
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
