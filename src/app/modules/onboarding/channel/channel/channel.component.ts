import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Upload } from '../../../../services/api/upload';
import { Client } from '../../../../services/api/client';
import { Session } from '../../../../services/session';
import { MindsUser } from '../../../../interfaces/entities';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'm-channel--onboarding--onboarding',
  template: `
    <div class="m-channelOnboarding__slide">
      <div class="m-channelOnboardingSlide__component">
        <label>Choose an avatar</label>

        <minds-avatar
          [object]="session.getLoggedInUser()"
          [editMode]="true"
          [icon]="'cloud_upload'"
          [showPrompt]="false"
          (added)="upload_avatar($event)"
          [waitForDoneSignal]="false"
        ></minds-avatar>
      </div>

      <div class="m-channelOnboardingSlide__component">
        <label
          for="display-name"
          i18n="@CHANNEL__ONBOARDING__CHOOSE_DISPLAY_NAME"
        >
          Choose your display name
        </label>
        <input
          id="display-name"
          #displayNameInput
          placeholder="eg. John Smith"
          i18n-placeholder="@CHANNEL__ONBOARDING__USERNAME_PLACEHOLDER"
          [ngModel]="user.username"
        />
      </div>

      <div class="m-channelOnboardingSlide__component">
        <label
          for="description"
          i18n="@CHANNEL__ONBOARDING__BRIEFLY_DESCRIBE_YOUR_CHANNEL"
        >
          Briefly describe your channel
        </label>
        <input
          id="description"
          #descriptionInput
          placeholder="eg. Independent Journalist"
          i18n-placeholder="@CHANNEL__ONBOARDING__BRIEFDESCRIPTION_PLACEHOLDER"
          [ngModel]="user.briefdescription"
        />
      </div>
    </div>
  `,
})
export class ChannelSetupOnboardingComponent {
  static items = ['avatar', 'display_name', 'briefdescription'];

  @Input() pendingItems: Array<string>;

  user: MindsUser;

  @ViewChild('displayNameInput', { static: true }) displayNameInput: ElementRef;
  @ViewChild('descriptionInput', { static: true }) descriptionInput: ElementRef;

  displayNameSubscription: Subscription;
  descriptionSubscription: Subscription;

  constructor(
    public client: Client,
    public upload: Upload,
    public session: Session
  ) {
    this.user = session.getLoggedInUser();
  }

  ngOnInit() {
    this.displayNameSubscription = fromEvent(
      this.displayNameInput.nativeElement,
      'keyup'
    )
      .pipe(debounceTime(1000))
      .subscribe(() =>
        this.updateUsername(this.displayNameInput.nativeElement.value)
      );

    this.descriptionSubscription = fromEvent(
      this.descriptionInput.nativeElement,
      'keyup'
    )
      .pipe(debounceTime(1000))
      .subscribe(() =>
        this.updateDescription(this.descriptionInput.nativeElement.value)
      );
  }

  async upload_avatar(file) {
    try {
      const response: any = await this.upload.post(
        'api/v1/channel/avatar',
        [file],
        { filekey: 'file' }
      );
      this.updateUser('icontime', Date.now());
    } catch (e) {
      console.error(e);
    }
  }

  async updateUsername(username: string) {
    try {
      await this.client.post('api/v1/channel/info', { name: username });
      this.updateUser('name', username);
    } catch (e) {
      console.error(e);
    }
  }

  async updateDescription(briefDescription: string) {
    try {
      await this.client.post('api/v1/channel/info', {
        briefdescription: briefDescription,
      });
      this.updateUser('briefdescription', briefDescription);
    } catch (e) {
      console.error(e);
    }
  }

  updateUser(prop: string, value: any) {
    let user = Object.assign({}, this.session.getLoggedInUser());
    user[prop] = value;
    this.session.userEmitter.next(user);
  }
}
