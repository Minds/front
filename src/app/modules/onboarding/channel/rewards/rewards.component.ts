import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Client } from '../../../../services/api/client';
import { Session } from '../../../../services/session';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FormToastService } from '../../../../common/services/form-toast.service';

@Component({
  selector: 'm-channel--onboarding--rewards',
  template: `
    <div class="m-channelOnboarding__slide">
      <h2>Earn tokens for your activity</h2>
      <p>
        Tokens can be used to support other channels or boost your content for
        additional views (1 token = 1,000 views).
      </p>

      <p>
        In order to earn tokens, we will need a phone number to verify that your
        channel is unique.
      </p>

      <!-- add phone input -->
      <div
        class="m-channelOnboardingSlideRewards__input"
        *ngIf="!confirming; else confirmBlock"
      >
        <m-phone-input [(ngModel)]="number" ngDefaultControl></m-phone-input>
        <button
          class="m-btn m-btn--slim m-btn--action"
          (click)="verify()"
          [disabled]="inProgress"
        >
          Join
        </button>
        <div
          *ngIf="inProgress"
          class="mdl-spinner mdl-js-spinner is-active"
          [mdl]
        ></div>
      </div>

      <ng-template #confirmBlock>
        <div class="m-channelOnboardingSlideRewards__input">
          <p
            class="m-channelOnboardingSlide__subtext m-channelOnboardingSlide__prompt"
          >
            Please enter the code we just sent to <b>+{{ number }}</b
            >, to verify your number.
          </p>
          <div class="m-channelOnboardingSlideForm__input">
            <input
              type="number"
              [(ngModel)]="code"
              placeholder="eg. 198349"
              class="m-border"
            />
            <m-tooltip icon="help">
              Please enter the code we just sent you, to verify that your number
              is correct
            </m-tooltip>
          </div>

          <div class="m-channelOnboardingSlideForm__buttons">
            <button
              class="m-btn m-btn--slim m-btn--action"
              (click)="confirm()"
              [disabled]="inProgress"
            >
              Confirm
            </button>
            <button class="m-btn m-btn--slim" (click)="cancel()">
              Go Back
            </button>
          </div>
          <div
            *ngIf="inProgress"
            class="mdl-spinner mdl-js-spinner is-active"
            [mdl]
          ></div>
        </div>
      </ng-template>

      <p class="m-channelOnboardingSlide__info">
        <i class="material-icons">info</i>
        We do not store your phone number in our servers.
      </p>
    </div>
  `,
})
export class TokenRewardsOnboardingComponent {
  static items = ['tokens_verification'];
  static canSkip: boolean = true;

  @Input() pendingItems: Array<string>;

  @Output() onClose: EventEmitter<any> = new EventEmitter<any>();
  number: string;
  code: string;

  inProgress: boolean;
  confirming: boolean;
  error: string;
  secret: string;

  paramsSubscription: Subscription;

  constructor(
    protected client: Client,
    protected cd: ChangeDetectorRef,
    protected session: Session,
    private route: ActivatedRoute,
    protected toasterService: FormToastService
  ) {}

  async verify() {
    this.inProgress = true;
    this.error = null;
    try {
      let response: any = await this.client.post(
        'api/v2/blockchain/rewards/verify',
        {
          number: this.number,
        }
      );
      this.secret = response.secret;
      this.confirming = true;
    } catch (e) {
      this.error = e.message;
      this.toasterService.error(this.error);
    }
    this.inProgress = false;
  }

  cancel() {
    this.confirming = false;
    this.code = null;
    this.secret = null;
    this.inProgress = false;
    this.error = null;
  }

  async confirm() {
    this.inProgress = true;
    this.error = null;
    try {
      let response: any = await this.client.post(
        'api/v2/blockchain/rewards/confirm',
        {
          number: this.number,
          code: this.code,
          secret: this.secret,
        }
      );

      this.session.getLoggedInUser().rewards = true;
      this.join();
    } catch (e) {
      this.error = e.message;
      this.toasterService.error(this.error);
    }

    this.inProgress = false;
  }

  join() {
    this.onClose.emit();
  }
}
