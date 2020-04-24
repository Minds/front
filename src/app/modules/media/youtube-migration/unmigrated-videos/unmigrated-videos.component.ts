import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { YoutubeMigrationService } from '../youtube-migration.service';
import { Session } from '../../../../services/session';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'm-youtubeMigration__unmigratedVideos',
  templateUrl: './unmigrated-videos.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YoutubeMigrationUnmigratedVideosComponent
  implements OnInit, OnDestroy {
  init: boolean = false;
  videos: any = [];
  unmigratedVideosSubscription: Subscription;

  constructor(
    protected youtubeService: YoutubeMigrationService,
    protected session: Session,
    protected route: ActivatedRoute,
    protected cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.unmigratedVideosSubscription = this.youtubeService.unmigratedVideos$.subscribe(
      unmigratedVideos => {
        this.videos = unmigratedVideos;
        this.init = true;
        this.detectChanges();
      }
    );

    this.route.queryParamMap.subscribe(params => {
      if (params.get('status') === 'setup') {
        alert('first time setup');
      }
    });
  }

  ngOnDestroy() {
    this.unmigratedVideosSubscription.unsubscribe();
  }

  openYoutubeWindow($event): void {
    const url: string = $event.video.url;
    window.open(url, '_blank');
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
