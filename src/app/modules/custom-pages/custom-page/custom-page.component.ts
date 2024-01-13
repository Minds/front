import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  CustomPageImplementation,
  CustomPageType,
} from '../custom-pages.types';
import { BehaviorSubject, Subscription, filter, take } from 'rxjs';
import { CustomPage } from '../../../../graphql/generated.engine';
import { CustomPageService } from '../../multi-tenant-network/services/custom-page.service';

/**
 * Presents simple custom pages on tenant sites.
 * (e.g. privacy policy, TOS community guidelines)
 *
 * Used when the tenant owner has not opted to use an external link.
 * (a.k.a. if they use default content or custom content)
 */

@Component({
  selector: 'm-customPage',
  templateUrl: './custom-page.component.html',
  styleUrls: ['./custom-page.component.ng.scss'],
})
export class CustomPageComponent implements OnInit, OnDestroy {
  /**
   * the type of page we're displaying
   * */
  protected pageType: CustomPageType;

  protected customPage: CustomPage;

  /**
   * the text of the page we're displaying
   * */
  protected displayContent: string;

  subscriptions: Subscription[] = [];

  /** Whether loading is in progress. */
  public loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    true
  );

  constructor(
    private service: CustomPageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.pageType = this.route.snapshot.data['pageType'];

    if (!this.pageType) {
      this.loading$.next(false);
      return;
    }

    // Get custom page from server to populate page
    this.subscriptions.push(
      this.service.customPage$.subscribe(customPage => {
        if (customPage) {
          this.customPage = customPage;
          this.displayContent = customPage.displayContent;
          if (!this.displayContent) {
            this.redirectToExternalLink();
          }
          this.loading$.next(false);
        }
      })
    );

    this.service.fetchCustomPage(this.pageType);
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  redirectToExternalLink(): void {
    if (this.customPage && this.customPage.externalLink) {
      window.location.href = this.customPage.externalLink;
    } else {
      console.error('No external link provided for redirection.');
    }
  }
}
