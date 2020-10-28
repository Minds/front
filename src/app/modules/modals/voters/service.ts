import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Client } from '../../../services/api/client';

export type VoteType = 'up' | 'down';

export interface VotersProps {
  guid: string;
  type: VoteType;
  title: string;
}

export interface VotersData {
  totalVoters: number;
  voters: {
    guid: string;
    icontime: string;
    username: string;
    name: string;
    type: string;
  }[];
}

@Injectable()
export default class VotersModalService {
  readonly isOpen$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  readonly inProgress$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  readonly title$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  readonly voters$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  readonly totalVoters$: BehaviorSubject<number> = new BehaviorSubject<number>(
    undefined
  );

  constructor(private client: Client) {}

  open(props: VotersProps) {
    this.load(props);
    this.title$.next(props.title);
    this.isOpen$.next(true);
  }

  close() {
    this.isOpen$.next(false);
    this.inProgress$.next(false);
    this.title$.next('');
    this.voters$.next([]);
  }

  /**
   * Loads voters by sending GET request to v3/voters endpoint
   * Adds response to local state.
   * @param props
   */
  public async load({ type, guid }: VotersProps): Promise<void> {
    this.inProgress$.next(true);
    const response = (await this.client.get(
      `api/v3/voters/${guid}/${type}`
    )) as VotersData;
    this.voters$.next(response.voters);
    this.totalVoters$.next(response.totalVoters);
    this.inProgress$.next(false);
  }
}
