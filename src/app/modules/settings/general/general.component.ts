import { Component, ElementRef, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { Session } from '../../../services/session';
import { Client } from '../../../services/api';
import { ThirdPartyNetworksService } from '../../../services/third-party-networks';
import { ConfigsService } from '../../../common/services/configs.service';

@Component({
  moduleId: module.id,
  selector: 'm-settings--general',
  templateUrl: 'general.component.html',
})
export class SettingsGeneralComponent {
  settings: string;

  error: string = '';
  changed: boolean = false;
  saved: boolean = false;
  inProgress: boolean = false;

  guid: string = '';
  name: string;
  email: string;
  mature: boolean = false;
  enabled_mails: boolean = true;
  toaster_notifications: boolean = true;
  show_share_buttons: boolean = true;

  password: string;
  password1: string;
  password2: string;

  languages: Array<{ code; name }> = [];
  language: string = 'en';

  categories: { id; label; selected }[];
  selectedCategories: string[] = [];

  paramsSubscription: Subscription;
  openSessions: number = 1;

  constructor(
    public session: Session,
    public element: ElementRef,
    public client: Client,
    public route: ActivatedRoute,
    public router: Router,
    public thirdpartynetworks: ThirdPartyNetworksService,
    private configs: ConfigsService
  ) {}

  ngOnInit() {
    this.languages = [];
    for (let code in this.configs.get('languages')) {
      if (this.configs.get('languages').hasOwnProperty(code)) {
        this.languages.push({
          code,
          name: this.configs.get('languages')[code],
        });
      }
    }

    this.paramsSubscription = this.route.params.subscribe(params => {
      if (
        params['guid'] &&
        params['guid'] === this.session.getLoggedInUser().guid
      ) {
        this.load(true);
      } else {
        this.load(false);
      }

      if (params['card'] && params['card'] !== '') {
        const el = this.element.nativeElement.querySelector(
          '.m-settings--' + params['card']
        );
        if (el) {
          window.scrollTo(0, el.offsetTop - 64); // 64 comes from the topbar's height
        }
      }
    });
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

  load(remote: boolean = false) {
    if (!remote) {
      const user = this.session.getLoggedInUser();
      this.name = user.name;
    }

    this.client.get('api/v1/settings/' + this.guid).then((response: any) => {
      console.log('LOAD', response.channel);
      this.email = response.channel.email;
      this.mature = !!parseInt(response.channel.mature, 10);
      this.enabled_mails = !parseInt(response.channel.disabled_emails, 10);
      this.language = response.channel.language || 'en';
      this.selectedCategories = response.channel.categories || [];
      this.openSessions = response.channel.open_sessions || 1;
      this.toaster_notifications = response.channel.toaster_notifications;
      this.show_share_buttons = !response.channel.hide_share_buttons;

      this.thirdpartynetworks.overrideStatus(response.thirdpartynetworks);

      if (this.selectedCategories.length > 0) {
        this.selectedCategories.forEach((item, index, array) => {
          const i: number = this.categories.findIndex(i => i.id === item);
          if (i !== -1) this.categories[i].selected = true;
        });
      }
    });
  }

  canSubmit() {
    if (!this.changed) return false;

    if (
      (this.password && !this.password1) ||
      (this.password && !this.password2)
    )
      return false;

    if (this.password1 && !this.password) {
      this.error = 'You must enter your current password';
      return false;
    }

    if (this.password1 !== this.password2) {
      this.error = 'Your new passwords do not match';
      return false;
    }

    this.error = '';

    return true;
  }

  change() {
    this.changed = true;
    this.saved = false;
  }

  save() {
    if (!this.canSubmit()) return;

    this.inProgress = true;
    this.client
      .post('api/v1/settings/' + this.guid, {
        name: this.name,
        email: this.email,
        password: this.password,
        new_password: this.password2,
        mature: this.mature ? 1 : 0,
        disabled_emails: this.enabled_mails ? 0 : 1,
        language: this.language,
        categories: this.selectedCategories,
        toaster_notifications: this.toaster_notifications,
        hide_share_buttons: !this.show_share_buttons,
      })
      .then((response: any) => {
        this.changed = false;
        this.saved = true;
        this.error = '';

        this.password = '';
        this.password1 = '';
        this.password2 = '';

        const user = this.session.getLoggedInUser();

        user.mature = this.mature ? 1 : 0;

        if (user.name !== this.name) {
          user.name = this.name;
        }

        if (this.language !== this.configs.get('language')) {
          window.location.reload(true); // This is ok client side as server will never save?
        }

        user.toaster_notifications = this.toaster_notifications;

        this.inProgress = false;
      })
      .catch(e => {
        this.inProgress = false;
        this.changed = false;
        this.error = e.message;
      });
  }

  // Third Party Networks

  connectFb() {
    this.thirdpartynetworks.connect('facebook').then(() => {
      this.load();
    });
  }

  connectTw() {
    this.thirdpartynetworks.connect('twitter').then(() => {
      this.load();
    });
  }

  removeFbLogin() {
    this.thirdpartynetworks.removeFbLogin();
  }

  removeFb() {
    this.thirdpartynetworks.disconnect('facebook');
  }

  removeTw() {
    this.thirdpartynetworks.disconnect('twitter');
  }

  closeAllSessions() {
    this.router.navigate(['/logout/all']);
  }
}
