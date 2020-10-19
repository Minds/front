import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { OnboardingV3PanelService } from '../panel/onboarding-panel.service';

@Component({
  selector: 'm-onboardingProgress',
  templateUrl: './onboarding-modal.component.html',
  styleUrls: ['./onboarding-modal.component.ng.scss'],
})
export class OnboardingV3ModalComponent {
  constructor(private panel: OnboardingV3PanelService) {}

  get disabled$(): Observable<boolean> {
    return this.panel.disableProgress$;
  }
}
