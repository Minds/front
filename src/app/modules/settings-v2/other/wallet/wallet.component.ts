import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToasterService } from '../../../../common/services/toaster.service';
import { Session } from '../../../../services/session';
import { SettingsV2WalletService } from './wallet.service';

/**
 * Settings v2 Wallet settings component.
 */
@Component({
  selector: 'm-settingsV2__wallet',
  templateUrl: 'wallet.component.html',
  styleUrls: ['wallet.component.ng.scss'],
})
export class SettingsV2WalletComponent implements OnInit {
  // user form.
  public form: FormGroup;

  // true when load in progress.
  public inProgress: boolean = true;

  constructor(
    private session: Session,
    private router: Router,
    private service: SettingsV2WalletService,
    private toast: ToasterService
  ) {}

  ngOnInit(): void {
    if (!this.session.isLoggedIn()) {
      this.router.navigate(['/login']);
    }

    this.form = new FormGroup({
      displayWalletBalance: new FormControl(
        !this.service.shouldHideWalletBalance()
      ),
    });

    this.inProgress = false;
  }

  /**
   * On submit button click, sets value to match the value indicated by the form.
   * @returns { void }
   */
  public submit(): void {
    this.service.setShouldHideWalletBalance(
      !this.form.get('displayWalletBalance').value
    );
    this.toast.success('Successfully changed wallet privacy settings.');
  }
}
