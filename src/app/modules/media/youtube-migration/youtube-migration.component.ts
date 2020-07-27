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
import { FeaturesService } from '../../../services/features.service';

@Component({
  selector: 'm-youtubeMigration',
  templateUrl: './youtube-migration.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YoutubeMigrationComponent implements OnInit, OnDestroy {
  init: boolean = false;
  connectedSubscription: Subscription;
  selectedChannelSubscription: Subscription;
  connected: boolean;
  channelTitle: string;
  channelId: string = '';

  constructor(
    protected youtubeService: YoutubeMigrationService,
    protected featuresService: FeaturesService,
    protected router: Router,
    protected route: ActivatedRoute,
    protected session: Session,
    protected cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (!this.featuresService.has('yt-importer')) {
      this.router.navigate(['settings/other']);
      return;
    }

    // Initialize service observables
    this.youtubeService.setup();

    this.connectedSubscription = this.youtubeService.connected$.subscribe(
      connected => {
        this.connected = connected;

        // Route to diff components based on connected state
        const destination = this.connected ? 'dashboard' : 'connect';
        this.router.navigate([destination], { relativeTo: this.route });
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
