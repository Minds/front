import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class GroupsSearchService {
  /**
   * Search query
   */
  readonly query$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor() {}
}
