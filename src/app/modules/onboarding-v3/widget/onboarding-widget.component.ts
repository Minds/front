import { Component, OnInit } from '@angular/core';
import { OnboardingV3Service } from '../onboarding-v3.service';

@Component({
  selector: 'm-onboardingProgress',
  templateUrl: './onboarding-widget.component.html',
  styleUrls: ['./onboarding-widget.component.ng.scss'],
})
export class OnboardingV3WidgetComponent implements OnInit {
  constructor(onboarding: OnboardingV3Service) {}

  ngOnInit(): void {}
}
