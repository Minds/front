import { Component, HostListener, OnInit } from '@angular/core';
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
export class SettingsTwoFactorV2BaseComponent implements OnInit {
  constructor(private service: SettingsTwoFactorV2Service) {}

  // on browser back button, reset the service (so that it goes back to the root component fresh)
  @HostListener('window:popstate', ['$event'])
  onPopState($event): void {
    this.service.reset();
  }

  /**
   * Currently active panel from service.
   * @returns { BehaviorSubject<TwoFactorSetupPanel> } - currently active panel.
   */
  get activePanel$(): BehaviorSubject<TwoFactorSetupPanel> {
    return this.service.activePanel$;
  }

  ngOnInit() {}
}
