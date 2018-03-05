import { Component, OnInit } from '@angular/core';
import { Client } from '../../../services/api/client';
import { Subscription } from 'rxjs/Rx';

@Component({
  selector: 'm-settings--emails',
  templateUrl: 'emails.component.html'
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
    }
  };

  error: string = '';
  changed: boolean = false;
  saved: boolean = false;
  inProgress: boolean = false;
  loading: boolean = false;

  paramsSubscription: Subscription;

  constructor(public client: Client) {
  }

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
    let response:any = await this.client.get('api/v2/settings/emails');
    response.notifications.forEach((item, index, list) => {
      let value = item.value;
      if (item.value === '1') {
        value = true;
      } else if (item.value === '0') {
        value = false;
      }
      this.notifications[item.campaign][item.topic] = value;
    });
    this.loading = false;
  }

  change() {
    this.changed = true;
    this.saved = false;
  }

  canSubmit() {
    return this.changed;
  }

  save() {
    if (!this.canSubmit())
      return;

    this.inProgress = true;
    this.client.post('api/v2/settings/emails', {
      'notifications': this.notifications
    })
      .then((response: any) => {
        this.changed = false;
        this.saved = true;
        this.error = '';

        this.inProgress = false;
      })
      .catch(e => {
        this.error = e;
        this.inProgress = false;
      });
  }

}
