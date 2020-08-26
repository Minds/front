import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewRef,
  Injector,
} from '@angular/core';
import { OverlayModalService } from '../../../../services/ux/overlay-modal';
import { Router } from '@angular/router';
import { YoutubeMigrationService } from '../youtube-migration.service';
import { Session } from '../../../../services/session';
import { FeaturesService } from '../../../../services/features.service';
import { ActivityModalCreatorService } from '../../../newsfeed/activity/modal/modal-creator.service';
import { EntitiesService } from '../../../../common/services/entities.service';

@Component({
  selector: 'm-youtubeMigration__migratedVideos',
  templateUrl: './migrated-videos.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YoutubeMigrationMigratedVideosComponent implements OnInit {
  init: boolean = false;
  videos: any = [];
  nextPageToken: string = '';
  moreData = true;
  inProgress = false;
  fewerResultsThanLimit = true;
  noInitResults = false;

  constructor(
    protected youtubeService: YoutubeMigrationService,
    protected session: Session,
    protected cd: ChangeDetectorRef,
    protected overlayModal: OverlayModalService,
    protected router: Router,
    private features: FeaturesService,
    private activityModalCreator: ActivityModalCreatorService,
    private injector: Injector,
    private entitiesService: EntitiesService
  ) {}

  ngOnInit() {
    this.load(true);
    this.init = true;
    this.detectChanges();
  }

  async load(refresh: boolean = false) {
    const limit = 12;

    if (this.inProgress) {
      return;
    }
    this.inProgress = true;

    if (refresh) {
      this.videos = [];
      this.moreData = true;
    }

    try {
      const response = <any>(
        await this.youtubeService.getVideos('completed', this.nextPageToken)
      );

      // Hide infinite scroll's 'nothing more to load' notice
      // if initial load length is less than response limit
      if (refresh && response.videos.length < limit) {
        this.fewerResultsThanLimit = true;
        this.moreData = false;
      } else {
        this.fewerResultsThanLimit = false;
      }

      if (!response.videos.length) {
        this.inProgress = false;
        this.moreData = false;

        // If no results on initial load, show notice instead of empty table
        if (refresh) {
          this.noInitResults = true;
          this.detectChanges();
          return;
        }

        this.detectChanges();
        return;
      }

      if (response['nextPageToken']) {
        this.nextPageToken = response['nextPageToken'];
      } else {
        this.moreData = false;
      }

      this.videos.push(...response.videos);
      this.inProgress = false;
      this.detectChanges();
    } catch (e) {
      this.moreData = false;
      this.inProgress = false;
      this.detectChanges();
      console.error(e);
    }
  }

  onModalRequested($event): void {
    this.activityModalCreator.create($event.video, this.injector);
  }

  detectChanges() {
    if (!(this.cd as ViewRef).destroyed) {
      this.cd.markForCheck();
      this.cd.detectChanges();
    }
  }
}
