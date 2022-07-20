import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class UserMenuService {
  /**
   * isOpen subject
   */
  readonly isOpen$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
}
