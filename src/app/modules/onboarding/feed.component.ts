import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Session } from '../../services/session';

@Component({
  moduleId: module.id,
  selector: 'm-onboarding-feed',
  templateUrl: 'feed.component.html'
})
export class OnboardingFeedComponent {

  paramsSubscription;

  constructor(
      private route: ActivatedRoute,
      public session: Session,
  ) { }

  ngOnDestroy() {
    if (this.paramsSubscription)
      this.paramsSubscription.unsubscribe();
  }

}
