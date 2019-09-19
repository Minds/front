import { Injectable } from '@angular/core';
import { Client } from '../../../../services/api/client';
import { Session } from '../../../../services/session';

@Injectable()
export class FilterService {
  constructor(private client: Client, private session: Session) {}

  loadFilterOptions() {
    const fakeFilterOptions = [
      'all dogs',
      'black labrador',
      'dachshund',
      'corgie',
      'poodle',
    ];
    return fakeFilterOptions;
  }

  onChange(selectionFx) {
    console.log(selectionFx);
  }
}
