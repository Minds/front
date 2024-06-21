import {
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { SidebarNavigationService } from '../../../../../common/layout/sidebar/navigation.service';
import { PageLayoutService } from '../../../../../common/layout/page-layout.service';
import { TopbarService } from '../../../../../common/layout/topbar.service';
import { isPlatformBrowser } from '@angular/common';
import { TenantCustomHomepageService } from '../../services/tenant-custom-homepage.service';
import { Subscription, filter, take } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

/**
 * Base component for tenant custom homepage.
 */
@Component({
  selector: 'm-homepage--customTenant',
  templateUrl: 'base.component.html',
  styleUrls: ['base.component.ng.scss'],
})
export class TenantCustomHomepageBaseComponent implements OnInit, OnDestroy {
  /** Viewchild of advertise section. */
  @ViewChild('advertiseSection', { read: ElementRef })
  protected advertiseSection: ElementRef;

  // subcription to homepage loaded state.
  private loadedSubscription: Subscription;

  constructor(
    private tenantCustomHomepageService: TenantCustomHomepageService,
    private navigationService: SidebarNavigationService,
    private pageLayoutService: PageLayoutService,
    private topbarService: TopbarService,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.navigationService.setVisible(false);
    this.pageLayoutService.useFullWidth();
    this.topbarService.isMinimalMode$.next(true);
    this.topbarService.toggleSearchBar(false);

    // Handle scroll anchors after components are done loading.
    if (isPlatformBrowser(this.platformId)) {
      this.loadedSubscription = this.tenantCustomHomepageService.isLoaded$
        .pipe(filter(Boolean), take(1))
        .subscribe((val: boolean): void => {
          if (this.route.snapshot.fragment === 'boost') {
            setTimeout(() => {
              this.advertiseSection.nativeElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
              });
            }, 0);
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.topbarService.isMinimalMode$.next(false);
    this.topbarService.toggleSearchBar(true);
    this.navigationService.setVisible(true);
    this.pageLayoutService.cancelFullWidth();
    this.loadedSubscription?.unsubscribe();
  }
}
