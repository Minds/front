import { Injectable } from '@angular/core';
import * as Sentry from '@sentry/angular';
import { Session } from '../../../services/session';
import { environment } from '../../../../environments/environment';
import { ConfigsService } from '../configs.service';
import { DiagnosticsInterface } from './diagnostics.service';
import { SENTRY_IGNORED_ERRORS } from './sentry-ignored-errors';
export { DiagnosticsService } from './diagnostics.service';

@Injectable()
export class BrowserDiagnosticsService implements DiagnosticsInterface {
  readonly environment: string;
  constructor(
    protected session: Session,
    configs: ConfigsService
  ) {
    this.environment = configs.get('environment');

    Sentry.init({
      dsn: 'https://bbf22a249e89416884e8d6e82392324f@o293216.ingest.us.sentry.io/5729114',
      environment: this.environment,
      release: environment.version,
      ignoreErrors: SENTRY_IGNORED_ERRORS,
    });
  }

  listen() {
    this.session.getLoggedInUser((currentUser) => {
      this.setUser(currentUser);
    });
  }

  setUser(currentUser) {
    let userId = null;

    if (currentUser) {
      userId = currentUser.guid || null;
    }

    // Sentry.setUser({
    //   id: userId,
    // });

    console.info(
      `Diagnostics ID: ${userId} | Environment: ${this.environment}`
    );
  }
}
