import { Component, OnInit } from '@angular/core';
import { MindsUser } from '../../../interfaces/entities';
import { SiteService } from '../../../common/services/site.service';

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

  /**
   * Modal options
   *
   * @param onComplete
   * @param onDismissIntent
   * @param defaults
   */
  set opts({ onComplete, onDismissIntent }) {
    this.onComplete = onComplete || (() => {});
    this.onDismissIntent = onDismissIntent || (() => {});
  }

  constructor(public siteService: SiteService) {}

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
}
