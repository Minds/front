import { Component, OnDestroy, OnInit } from '@angular/core';
import { SidebarNavigationService } from '../../../../../common/layout/sidebar/navigation.service';
import { PageLayoutService } from '../../../../../common/layout/page-layout.service';
import { TopbarService } from '../../../../../common/layout/topbar.service';

/**
 * Base component for tenant custom homepage.
 */
@Component({
  selector: 'm-homepage--customTenant',
  templateUrl: 'base.component.html',
  styleUrls: ['base.component.ng.scss'],
})
export class TenantCustomHomepageBaseComponent implements OnInit, OnDestroy {
  constructor(
    private navigationService: SidebarNavigationService,
    private pageLayoutService: PageLayoutService,
    private topbarService: TopbarService
  ) {}

  ngOnInit(): void {
    this.navigationService.setVisible(false);
    this.pageLayoutService.useFullWidth();
    this.topbarService.isMinimalLightMode$.next(true);
    this.topbarService.toggleSearchBar(false);
  }

  ngOnDestroy(): void {
    this.topbarService.isMinimalLightMode$.next(false);
    this.topbarService.toggleSearchBar(true);
    this.navigationService.setVisible(true);
    this.pageLayoutService.cancelFullWidth();
  }
}
