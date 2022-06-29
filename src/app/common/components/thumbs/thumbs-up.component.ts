import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  Input,
  OnChanges,
  ViewChild,
} from '@angular/core';

import { Session } from '../../../services/session';
import { Client } from '../../../services/api';
import { WalletService } from '../../../services/wallet';
import { AuthModalService } from '../../../modules/auth/modal/auth-modal.service';
import { ExperimentsService } from '../../../modules/experiments/experiments.service';
import { FriendlyCaptchaComponent } from '../../../modules/captcha/friendly-catpcha/friendly-captcha.component';
import { FormToastService } from '../../services/form-toast.service';

@Component({
  selector: 'minds-button-thumbs-up',
  inputs: ['_object: object'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'thumbs-up.component.html',
  styleUrls: [`thumbs-up.component.ng.scss`],
})
export class ThumbsUpButton implements DoCheck, OnChanges {
  changesDetected: boolean = false;
  object = {
    guid: null,
    owner_guid: null,
    'thumbs:up:user_guids': [],
  };

  public initCaptcha = false;
  public showSpinner = false;

  @Input() iconOnly = false;

  @ViewChild(FriendlyCaptchaComponent)
  friendlyCaptchaEl: FriendlyCaptchaComponent;

  constructor(
    public session: Session,
    public client: Client,
    public wallet: WalletService,
    private authModal: AuthModalService,
    private cd: ChangeDetectorRef,
    private experiments: ExperimentsService,
    private toast: FormToastService
  ) {}

  set _object(value: any) {
    if (!value) return;
    this.object = value;
    if (!this.object['thumbs:up:user_guids'])
      this.object['thumbs:up:user_guids'] = [];
  }

  public preliminaryChecks(): void {
    this.initCaptcha = true;
    this.showSpinner = true;
  }

  async thumb(solution?: string): Promise<void> {
    this.showSpinner = true;
    this.cd.detectChanges();
    if (!this.session.isLoggedIn()) {
      const user = await this.authModal.open();
      if (!user) return;
    }
    let data = {};
    if (this.isFriendlyCaptchaFeatureEnabled()) {
      data = {
        puzzle_solution: solution,
      };
    }

    try {
      let response = await this.client.put(
        'api/v1/thumbs/' + this.object.guid + '/up',
        data
      );
    } catch (e) {
      this.toast.error(e?.message ?? 'An unknown error has occurred');
    }

    this.initCaptcha = false;
    this.showSpinner = false;
    if (!this.has()) {
      this.object['thumbs:up:user_guids'] = [
        this.session.getLoggedInUser().guid,
      ];
      this.object['thumbs:up:count']++;
    } else {
      for (let key in this.object['thumbs:up:user_guids']) {
        if (
          this.object['thumbs:up:user_guids'][key] ===
          this.session.getLoggedInUser().guid
        )
          delete this.object['thumbs:up:user_guids'][key];
      }
      this.object['thumbs:up:count']--;
    }
    this.cd.detectChanges();
  }

  has() {
    for (var guid of this.object['thumbs:up:user_guids']) {
      if (guid === this.session.getLoggedInUser().guid) return true;
    }
    return false;
  }

  public shouldShowSpinner(): boolean {
    return this.showSpinner;
  }

  public isFriendlyCaptchaFeatureEnabled(): boolean {
    return this.experiments.hasVariation(
      'minds-3119-captcha-for-engagement',
      true
    );
  }

  public shouldFriendlyCaptchaShow(): boolean {
    return (
      this.isFriendlyCaptchaFeatureEnabled() && this.initCaptcha && !this.has()
    );
  }

  ngOnChanges(changes) {}

  ngDoCheck() {
    this.changesDetected = false;
    if (this.object['thumbs:up:count'] != this.object['thumbs:up:count:old']) {
      this.object['thumbs:up:count:old'] = this.object['thumbs:up:count'];
      this.changesDetected = true;
    }

    if (this.changesDetected) {
      this.cd.detectChanges();
    }
  }
}
