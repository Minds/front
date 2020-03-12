import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';

import { DialogService } from '../../../../common/services/confirm-leave-dialog.service';
import { Observable } from 'rxjs';
import { Client } from '../../../../services/api';

@Component({
  selector: 'm-settingsV2__emailNotifications',
  templateUrl: './email-notifications.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsV2EmailNotificationsComponent implements OnInit {
  @Output() formSubmitted: EventEmitter<any> = new EventEmitter();
  init: boolean = false;
  inProgress: boolean = false;
  changed: boolean = false;

  notifications: any = {
    when: {
      unread_notifications: false,
      wire_received: false,
      boost_completed: false,
    },
    with: {
      top_posts: false, // weekly
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

  constructor(
    protected cd: ChangeDetectorRef,
    private dialogService: DialogService,
    public client: Client
  ) {}

  ngOnInit() {
    this.load();
  }

  async load() {
    this.inProgress = true;
    this.detectChanges();

    const response: any = await this.client.get('api/v2/settings/emails');
    console.log('LOAD', response.notifications[4]);
    response.notifications.forEach((item, index, list) => {
      let value = item.value;
      if (item.value === '1') {
        value = true;
      } else if (item.value === '0') {
        value = false;
      }
      this.notifications[item.campaign][item.topic] = value;
    });
    this.init = true;
    this.inProgress = false;
    this.detectChanges();
  }

  async submit() {
    if (!this.canSubmit()) {
      return;
    }
    this.inProgress = true;
    this.detectChanges();
    console.log('submit', this.notifications.when);

    this.client
      .post('api/v2/settings/emails', {
        notifications: this.notifications,
      })
      .then((response: any) => {
        this.load();
        this.formSubmitted.emit({ formSubmitted: true });
        this.changed = false;
        this.inProgress = false;
        this.detectChanges();
      })
      .catch(e => {
        this.formSubmitted.emit({ formSubmitted: false, error: e });
        this.inProgress = false;
        this.detectChanges();
      });
  }

  change() {
    this.changed = true;
    this.detectChanges();
  }

  onTopPostsCheckboxChange(value: boolean) {
    if (value) {
      this.notifications.with.top_posts = 'weekly';
    } else {
      this.notifications.with.top_posts = false;
    }
    this.detectChanges();
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.changed) {
      return true;
    }

    return this.dialogService.confirm('Discard changes?');
  }

  canSubmit(): boolean {
    return !this.inProgress && this.changed;
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
