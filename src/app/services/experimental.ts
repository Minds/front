import { Injectable } from '@angular/core';
import { Session } from './session';

@Injectable()
export class Experimental {
  constructor(private session: Session) {}

  feature(feature: string): boolean {
    const user = this.session.getLoggedInUser();
    return (
      user &&
      user.feature_flags &&
      user.feature_flags.length &&
      user.feature_flags.indexOf(feature) > -1
    );
  }
}
