import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { Session } from '../../../../services/session';
import { MindsUser } from '../../../../interfaces/entities';
import { SettingsV2Service } from '../../settings-v2.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Client } from '../../../../services/api';

@Component({
  selector: 'm-settingsV2__sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsV2SessionsComponent implements OnInit, OnDestroy {
  openSessions: number = 1;
  user: MindsUser;
  settingsSubscription: Subscription;
  init: boolean = false;
  sessions: Array<any>;

  menuOpened$: BehaviorSubject<number | null> = new BehaviorSubject(null);

  constructor(
    protected cd: ChangeDetectorRef,
    protected router: Router,
    private session: Session,
    protected settingsService: SettingsV2Service,
    protected client: Client
  ) {}

  ngOnInit() {
    this.getSessions();
  }

  async getSessions(): Promise<void> {
    this.init = false;

    // ojm make sure the last_active in actual responses displays relative to local time

    const response = <any>(
      await this.client.get('api/v3/sessions/common-sessions/all')
    );

    this.sessions = response.sessions;
    console.log('ojm response', response, response[0]);

    this.init = true;
    this.detectChanges();
  }

  async deleteSession(session) {
    this.menuOpened$.next(null);

    const response = <any>(
      await this.client.delete(
        `api/v3/sessions/common-sessions/session?id=${session.id}&platform=${session.platform}`
      )
    );

    if (response && response.status === 'success') {
      this.getSessions();
    }
  }

  onButtonClick(i): void {
    this.menuOpened$.next(i);
    this.detectChanges();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    if (this.settingsSubscription) {
      this.settingsSubscription.unsubscribe();
    }
  }
}
