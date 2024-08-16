import { Injectable } from '@angular/core';
import * as Sentry from '@sentry/angular';
import { Session } from '../../../services/session';
import { environment } from '../../../../environments/environment';
import { ConfigsService } from '../configs.service';
import { DiagnosticsInterface } from './diagnostics.service';

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
      dsn: 'https://7998981a581a2fb91a13a2cbf192fd1d@o339296.ingest.us.sentry.io/1875291',
      environment: this.environment,
      release: environment.version,
      ignoreErrors: [
        /request was interrupted by a call to/i,
        /executing a cancelled action/i,
        /AbortError: The fetching process for the media resource/i,
        /AbortError: The operation was aborted./i,
        /AbortError: The play\(\) request was interrupted by a new load request./i,
        /NotAllowedError: play\(\) can only be initiated by a user gesture./i,
        /Recognizer.noMatchError/,
        'RangeError',
      ],
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
