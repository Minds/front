import { Component, OnInit } from '@angular/core';
import { MindsUser } from '../../../interfaces/entities';
import { SiteService } from '../../../common/services/site.service';
import { ConfigsService } from '../../../common/services/configs.service';

/**
 * Auth modal that can display either login or register form
 */
@Component({
  selector: 'm-auth__modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.ng.scss'],
})
export class AuthModalComponent implements OnInit {
  formDisplay: 'register' | 'login' = 'register';

  /**
   * Completion intent
   */
  onComplete: (any) => any = () => {};

  /**
   * Dismiss intent
   */
  onDismissIntent: () => void = () => {};

  public readonly cdnAssetsUrl: string;

  constructor(public siteService: SiteService, configs: ConfigsService) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }

  ngOnInit(): void {}

  /**
   * Called when register form is completed
   * @param user
   */
  onRegisterDone(user: MindsUser): void {
    this.onComplete(user);
  }

  /**
   * Called when login form is completed
   * @param user
   */
  onLoginDone(user: MindsUser): void {
    this.onComplete(user);
  }

  /**
   * Shows the login form
   * @param e
   */
  showLoginForm(e: MouseEvent): void {
    this.formDisplay = 'login';
  }

  /**
   * Shows the register form
   * @param e
   */
  showRegisterForm(e: MouseEvent): void {
    this.formDisplay = 'register';
  }

  /**
   * Modal options
   *
   * @param onComplete
   * @param onDismissIntent
   * @param defaults
   */
  setModalData({ formDisplay, onComplete, onDismissIntent }) {
    this.formDisplay = formDisplay;
    this.onComplete = onComplete || (() => {});
    this.onDismissIntent = onDismissIntent || (() => {});
  }
}
