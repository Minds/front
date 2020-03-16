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
import { Subscription } from 'rxjs';

@Component({
  selector: 'm-settingsV2__sessions',
  templateUrl: './sessions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsV2SessionsComponent implements OnInit, OnDestroy {
  openSessions: number = 1;
  user: MindsUser;
  settingsSubscription: Subscription;

  constructor(
    protected cd: ChangeDetectorRef,
    protected router: Router,
    private session: Session,
    protected settingsService: SettingsV2Service
  ) {}

  ngOnInit() {
    this.user = this.session.getLoggedInUser();

    this.settingsSubscription = this.settingsService.settings$.subscribe(
      (settings: any) => {
        this.openSessions = settings.open_sessions || 1;
        this.detectChanges();
      }
    );
  }

  closeAllSessions() {
    this.router.navigate(['/logout/all']);
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
