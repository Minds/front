import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Client } from '../../services/api';
import { Session, SessionFactory } from '../../services/session';
import { Storage } from '../../services/storage';

@Injectable()
export class OnboardingService {

  static paramsSubscription;

  constructor(private client: Client, private session: Session, private storage: Storage, private route: ActivatedRoute) {

  }

  enable() {
    this.storage.set('onboarding', true);
  }

  shouldShow(id): boolean {
    if (!this.storage.get('onboarding'))
      return false;

    if (this.storage.get('onboarding.seen.' + id))
      return false;

    return true;
  }

  hide(id: string) {
    this.storage.set('onboarding.seen.' + id, true);
  }

}
