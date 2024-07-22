import { Component, Injector, OnDestroy } from '@angular/core';
import { ComposerModalService } from '../../../composer/components/modal/modal.service';
import { ComposerBoostService } from '../../../composer/services/boost.service';
import { Router } from '@angular/router';
import { BoostLatestPostNoticeService } from '../boost-latest-post/boost-latest-post-notice.service';
import { Subscription, take } from 'rxjs';
import { ToasterService } from '../../../../common/services/toaster.service';

/**
 * Feed notice intended to be displayed only in Boost console,
 * when browsing newsfeed boosts and the explore feed.
 */
@Component({
  selector: 'm-feedNotice--createBoost',
  templateUrl: 'create-boost-notice.component.html',
})
export class CreateBoostNoticeComponent implements OnDestroy {
  // subscription to latest posts.
  private latestPostSubscription: Subscription;

  constructor(
    private composerModalService: ComposerModalService,
    private composerBoostService: ComposerBoostService,
    private boostLatestPostNoticeService: BoostLatestPostNoticeService,
    private toaster: ToasterService,
    private router: Router,
    private injector: Injector
  ) {}

  ngOnDestroy(): void {
    this.composerBoostService.reset();
    this.latestPostSubscription?.unsubscribe();
  }

  /**
   * Called on Create Boost click.
   * @return { void }
   */
  public onCreateBoostClick(): void {
    this.composerBoostService.isBoostMode$.next(true);
    this.composerModalService.setInjector(this.injector).present();
  }

  /**
   * Called on Boost latest post click.
   * @return { void }
   */
  public onBoostLatestPostClick(): void {
    this.latestPostSubscription = this.boostLatestPostNoticeService.latestPost$
      .pipe(take(1))
      .subscribe((latestPost) => {
        if (!latestPost) {
          this.toaster.warn(
            'Something went wrong while finding your latest post.'
          );
          return;
        }

        this.router.navigate(['newsfeed', latestPost.guid], {
          queryParams: {
            boostModalDelayMs: 1000,
          },
        });
      });
  }
}
