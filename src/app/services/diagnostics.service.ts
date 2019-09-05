import { Injectable } from '@angular/core';
import * as Sentry from '@sentry/browser';
import { Session } from './session';

@Injectable()
export class DiagnosticsService {
  constructor(protected session: Session) {}

  listen() {
    this.session.getLoggedInUser(currentUser => {
      this.setUser(currentUser);
    });
  }

  setUser(currentUser) {
    let userId = null;

    if (currentUser) {
      userId = currentUser.guid || null;
    }

    Sentry.setUser({
      id: userId,
    });

    console.info('Diagnostics ID:', userId);
  }
}
