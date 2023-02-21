import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import {
  YoutubeMigrationService,
  YoutubeChannel,
} from './youtube-migration.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Session } from '../../../services/session';
import { LoginReferrerService } from '../../../services/login-referrer.service';
import { HostListener } from '@angular/core';

@Component({
  selector: 'm-youtubeMigration',
  templateUrl: './youtube-migration.component.html',
  styleUrls: ['youtube-migration.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YoutubeMigrationComponent implements OnInit, OnDestroy {
  init: boolean = false;
  connectedSubscription: Subscription;
  selectedChannelSubscription: Subscription;
  connected: boolean;
  channelTitle: string;
  channelId: string = '';
  readonly youtubeSettingsUrl: string = '/settings/other/youtube-migration';

  /**
   * On back button press.
   */
  @HostListener('window:popstate', ['$event'])
  public onPopState(event): void {
    event.preventDefault();
    this.goBack();
  }

  constructor(
    protected youtubeService: YoutubeMigrationService,
    protected router: Router,
    protected route: ActivatedRoute,
    protected session: Session,
    protected cd: ChangeDetectorRef,
    protected loginReferrer: LoginReferrerService
  ) {}

  ngOnInit() {
    if (!this.session.isLoggedIn()) {
      this.loginReferrer.register(this.youtubeSettingsUrl);
      return;
    }

    // Initialize service observables
    this.youtubeService.setup();

    this.connectedSubscription = this.youtubeService.connected$.subscribe(
      connected => {
        this.connected = connected;

        // Route to diff components based on connected state
        const destination = this.connected ? 'dashboard' : 'connect';
        this.router.navigate([destination], {
          relativeTo: this.route,
          skipLocationChange: true,
        });
        this.detectChanges();
      }
    );

    // Display the name of the selected channel
    this.selectedChannelSubscription = this.youtubeService.selectedChannel$.subscribe(
      channel => {
        if (this.connected && channel.title) {
          this.channelTitle = channel.title;
          this.detectChanges();
        }
      }
    );
    this.init = true;
    this.detectChanges();
  }

  ngOnDestroy() {
    if (this.connectedSubscription) {
      this.connectedSubscription.unsubscribe();
    }
    if (this.selectedChannelSubscription) {
      this.selectedChannelSubscription.unsubscribe();
    }
  }

  /**
   * Go back to the settings 'Other' menu
   */
  goBack(): void {
    this.router.navigate(['../../'], { relativeTo: this.route.firstChild });
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
