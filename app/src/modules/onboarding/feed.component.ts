import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OnboardingService } from './onboarding.service';
import { Session, SessionFactory } from '../../services/session';

@Component({
  moduleId: module.id,
  selector: 'm-onboarding-feed',
  templateUrl: 'feed.component.html'
})
export class OnboardingFeedComponent {

  paramsSubscription;

  constructor(public service: OnboardingService, private route: ActivatedRoute, public session: Session) {

  }

  ngOnInit() {
    this.paramsSubscription = this.route.params.subscribe((params) => {
      if (params['onboarding'])
        this.service.enable();
    });
  }

  ngOnDestroy() {
    if (this.paramsSubscription)
      this.paramsSubscription.unsubscribe();
  }

}
