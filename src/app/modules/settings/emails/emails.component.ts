import { Component, OnInit } from '@angular/core';
import { Client } from '../../../services/api/client';
import { Subscription } from 'rxjs';

import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { ConfirmPasswordModalComponent } from '../../modals/confirm-password/modal.component';
import { Session } from '../../../services/session';

@Component({
  selector: 'm-settings--emails',
  templateUrl: 'emails.component.html',
})
export class SettingsEmailsComponent implements OnInit {
  notifications: any = {
    when: {
      unread_notifications: false,
      wire_received: false,
      boost_completed: false,
    },
    with: {
      top_posts: false, //periodically, daily, weekly
      channel_improvement_tips: false,
      posts_missed_since_login: false,
      new_channels: false,
    },
    global: {
      minds_news: false,
      minds_tips: false,
      exclusive_promotions: false,
    },
  };

  email: string = '';

  error: string = '';
  changed: boolean = false;
  emailChanged: boolean = false;
  saved: boolean = false;
  inProgress: boolean = false;
  loading: boolean = false;

  paramsSubscription: Subscription;

  constructor(
    public client: Client,
    public overlayModal: OverlayModalService,
    protected session: Session
  ) {}

  ngOnInit() {
    this.load();
  }

  onTopPostsCheckboxChange(value: boolean) {
    if (value) {
      this.notifications.with.top_posts = 'periodically';
    } else {
      this.notifications.with.top_posts = false;
    }
  }

  async load() {
    this.loading = true;
    let response: any = await this.client.get('api/v2/settings/emails');
    response.notifications.forEach((item, index, list) => {
      let value = item.value;
      if (item.value === '1') {
        value = true;
      } else if (item.value === '0') {
        value = false;
      }
      this.notifications[item.campaign][item.topic] = value;
    });
    this.email = response.email;
    this.loading = false;
  }

  change() {
    this.changed = true;
    this.saved = false;
  }

  changeEmail() {
    this.emailChanged = true;
  }

  canSubmit() {
    return this.changed;
  }

  submit() {
    this.inProgress = true;
    this.client
      .post('api/v2/settings/emails', {
        email: this.email,
        notifications: this.notifications,
      })
      .then((response: any) => {
        if (this.emailChanged && this.session.getLoggedInUser()) {
          this.session.getLoggedInUser().email_confirmed = false;
        }

        this.changed = false;
        this.emailChanged = false;
        this.saved = true;
        this.error = '';

        this.inProgress = false;
      })
      .catch(e => {
        this.error = e;
        this.inProgress = false;
      });
  }

  save() {
    if (!this.canSubmit()) return;

    const creator = this.overlayModal.create(
      ConfirmPasswordModalComponent,
      {},
      {
        class: 'm-overlay-modal--small',
        onComplete: wire => {
          this.submit();
        },
      }
    );
    creator.present();
  }
}
