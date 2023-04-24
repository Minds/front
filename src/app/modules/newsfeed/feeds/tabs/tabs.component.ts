import { Component } from '@angular/core';
import { NewsfeedForYouExperimentService } from '../../../experiments/sub-services/newsfeed-for-you-experiment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { FeedAlgorithm } from '../subscribed.component';

/*
 * Header tabs for newsfeed.
 */
@Component({
  selector: 'm-newsfeed__tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.ng.scss'],
})
export class NewsfeedTabsComponent {
  /** Currently active tab. */
  protected readonly activeTab$: BehaviorSubject<
    FeedAlgorithm
  > = new BehaviorSubject<FeedAlgorithm>(null);

  /** Feed algorithm enum. */
  protected readonly feedAlgorithm: typeof FeedAlgorithm = FeedAlgorithm;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private newsfeedForYouExperiment: NewsfeedForYouExperimentService
  ) {
    this.activeTab$.next(this.route.snapshot.params.algorithm);
  }

  /**
   * On tab click, sets the currently active tab and then sends a call to
   * update the route parameter to the back of the event queue, to give the
   * newly active tab's bottom border time to render before we start a
   * computationally expensive operation that can block rendering and
   * can otherwise cause a jarring delay in the users click feedback.
   * @param { FeedAlgorithm } tab - tab to switch to.
   * @returns { void }
   */
  protected onTabClick(tab: FeedAlgorithm): void {
    this.activeTab$.next(tab);

    setTimeout(
      () => this.router.navigate([`../${tab}`], { relativeTo: this.route }),
      1
    );
  }

  /**
   * Whether For You tab should be shown.
   * @returns { boolean } true if for you tab should be shown.
   */
  protected shouldShowForYouTab(): boolean {
    return this.newsfeedForYouExperiment.isActive();
  }
}
