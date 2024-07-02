import { Component, Injector, OnDestroy } from '@angular/core';
import { ComposerModalService } from '../../../composer/components/modal/modal.service';
import { ComposerBoostService } from '../../../composer/services/boost.service';

/**
 * Feed notice intended to be displayed only in Boost console,
 * when browsing newsfeed boosts and the explore feed.
 */
@Component({
  selector: 'm-feedNotice--createBoost',
  templateUrl: 'create-boost-notice.component.html',
})
export class CreateBoostNoticeComponent implements OnDestroy {
  constructor(
    private composerModalService: ComposerModalService,
    private composerBoostService: ComposerBoostService,
    private injector: Injector
  ) {}

  ngOnDestroy(): void {
    this.composerBoostService.reset();
  }

  /**
   * Called on primary option click.
   * @return { void }
   */
  public onPrimaryOptionClick(): void {
    this.composerBoostService.isBoostMode$.next(true);
    this.composerModalService.setInjector(this.injector).present();
  }
}
