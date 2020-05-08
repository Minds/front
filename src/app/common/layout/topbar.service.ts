import { V2TopbarComponent } from './v2-topbar/v2-topbar.component';
import { V3TopbarComponent } from './v3-topbar/v3-topbar.component';
import { FeaturesService } from '../../services/features.service';
import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

type TopbarComponentT = V2TopbarComponent | V3TopbarComponent;

@Injectable()
export class TopbarService {
  private container: TopbarComponentT;

  private useV3Topbar: boolean;

  routerSubscription: Subscription;

  constructor(
    private featuresService: FeaturesService,
    private router: Router
  ) {
    this.useV3Topbar = this.featuresService.has('navigation');
    this.routerSubscription = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(data => {
        this.toggleVisibility(true);
        this.toggleSearchBar(true);
      });
  }

  setContainer(container: TopbarComponentT) {
    this.container = container;

    return this;
  }

  toggleMarketingPages(
    value: boolean,
    showBottombar: boolean = true,
    forceBackground: boolean = true
  ): void {
    if (this.container) {
      if (this.useV3Topbar) {
      } else {
        this.container.toggleMarketingPages(
          value,
          showBottombar,
          forceBackground
        );
      }
    }
  }

  toggleVisibility(visible: boolean): void {
    if (this.container) {
      if (this.useV3Topbar) {
        this.container.toggleVisibility(visible);
      } else {
        this.container.toggleVisibility(visible);
      }
    }
  }

  toggleSearchBar(visible: boolean): void {
    if (this.container) {
      if (this.useV3Topbar && this.container instanceof V3TopbarComponent) {
        this.container.toggleSearchBar(visible);
      }
    }
  }
}
