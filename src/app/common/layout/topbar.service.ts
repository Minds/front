import { V3TopbarComponent } from './v3-topbar/v3-topbar.component';
import { FeaturesService } from '../../services/features.service';
import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

type TopbarComponentT = V3TopbarComponent;

@Injectable()
export class TopbarService {
  private container: TopbarComponentT;

  routerSubscription: Subscription;

  constructor(
    private featuresService: FeaturesService,
    private router: Router
  ) {
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
  ): void {}

  toggleVisibility(visible: boolean): void {
    if (this.container) {
      this.container.toggleVisibility(visible);
    }
  }

  toggleSearchBar(visible: boolean): void {
    if (this.container) {
      (<V3TopbarComponent>this.container).toggleSearchBar(visible);
    }
  }
}
