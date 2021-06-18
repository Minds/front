import { Component, HostListener } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  SettingsTwoFactorV2Service,
  TwoFactorSetupPanel,
} from './two-factor-v2.service';

/**
 * Base component, used to display header and panels.
 */
@Component({
  selector: 'm-settings__twoFactorBase--V2',
  templateUrl: './two-factor-v2-base.component.html',
  styleUrls: ['./two-factor-v2-base.component.ng.scss'],
})
export class SettingsTwoFactorV2BaseComponent {
  // on browser back button, reset the service (so that it goes back to the root component fresh)
  @HostListener('window:popstate', ['$event'])
  onPopState($event): void {
    this.onBackPress();
  }

  /**
   * Currently active panel from service.
   * @returns { BehaviorSubject<TwoFactorSetupPanel> } - currently active panel.
   */
  get activePanel$(): BehaviorSubject<TwoFactorSetupPanel> {
    return this.service.activePanel$;
  }

  constructor(private service: SettingsTwoFactorV2Service) {}

  /**
   * Reset the service on back press.
   * @returns { void }
   */
  public onBackPress(): void {
    this.service.reset();
  }
}
