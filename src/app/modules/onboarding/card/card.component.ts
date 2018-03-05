import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OnboardingService } from '../onboarding.service';

@Component({
  moduleId: module.id,
  selector: 'm-onboarding-card',
  templateUrl: 'card.component.html'
})
export class OnboardingCardComponent {

  @Input() route;
  @Input() icon;
  @Input() text;
  @Input() subtext;
  @Input() class;
  @Input() id;

  constructor(public service: OnboardingService) { }

  close(e) {
    e.stopPropagation();
    this.service.hide(this.id);
  }

}
