import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";

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

  constructor() { }

  ngOnInit() {
  
  }

}
