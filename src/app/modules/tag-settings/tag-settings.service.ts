import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class TagSettingsService {
  // This allows us to submit from different parent components
  submitRequested$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  constructor() {}
}
