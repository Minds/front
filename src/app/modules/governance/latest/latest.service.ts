import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Client } from '../../../services/api';
import { BehaviorSubject } from 'rxjs';
import { isPlatformServer } from '@angular/common';

export type SnapshotProposal = {
  body: string;
  choices: Array<string>;
  end: number;
  network: string;
  strategies: Array<any>;
  name: string;
  snapshot: number;
  start: number;
};

export type GovernanceLatest = {
  created_at: string;
  deleted: boolean;
  deleted_by: string;
  description: string;
  discourse_id: number;
  discourse_topic_id: number;
  enacted: false;
  finish_at: string;
  id: string;
  required_to_pass: number;
  snapshot_id: string;
  snapshot_network: string;
  snapshot_proposal: SnapshotProposal;
  snapshot_signature: string;
  snapshot_space: string;
  start_at: string;
  status: string;
  title: string;
  type: string;
  updated_at: string;
  user: string;
};

@Injectable()
export class GovernanceLatestService {
  proposals$: BehaviorSubject<GovernanceLatest[]> = new BehaviorSubject([]);
  totalProposals$: BehaviorSubject<number> = new BehaviorSubject(0);
  inProgress$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  error$: BehaviorSubject<string> = new BehaviorSubject('');

  constructor(
    private client: Client,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  async loadProposals(): Promise<void> {
    this.inProgress$.next(true);

    if (isPlatformServer(this.platformId)) return;

    this.proposals$.next([]);
    this.totalProposals$.next(0);
    this.error$.next('');
    try {
      const response: any = await this.client.get(
        'assets/mocks/governance/latest.json'
      );
      this.proposals$.next(response.data);
      this.totalProposals$.next(response.data.length);
    } catch (err) {
      this.proposals$.next(err.data);
      this.totalProposals$.next(err.data.length);
      // this.error$.next(err.error.errorId);
    } finally {
      this.inProgress$.next(false);
    }
  }
}
