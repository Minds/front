import { Injectable } from '@angular/core';
import { DiscoveryRedirectExperimentService } from '../../modules/experiments/sub-services/discovery-redirect-experiment.service';

/**
 * Currently this service is used only as a way to communicate
 * with the 'discovery-redirect' experiment
 * but in future it should be used a centralized redirect service
 * for all logins and registrations
 */
@Injectable()
export class AuthRedirectService {
  constructor(
    public discoveryRedirectExperiment: DiscoveryRedirectExperimentService
  ) {}

  getRedirectUrl(): string {
    return this.discoveryRedirectExperiment.getRedirectUrl();
  }
}
