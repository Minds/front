import { Injectable } from '@angular/core';
import { DiscoveryRedirectExperimentService } from '../../modules/experiments/sub-services/discovery-redirect-experiment.service';

@Injectable()
export class AuthRedirectService {
  constructor(
    public discoveryRedirectExperiment: DiscoveryRedirectExperimentService
  ) {}

  redirectUrl(): string {
    return this.discoveryRedirectExperiment.redirectUrl();
  }
}
