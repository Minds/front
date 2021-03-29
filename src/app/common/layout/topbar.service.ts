import { FeaturesService } from '../../services/features.service';
import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { V3TopbarInterface } from './v3-topbar/v3-topbar.interface';

@Injectable()
export class TopbarService {
  private container: V3TopbarInterface;

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

  setContainer(container: V3TopbarInterface) {
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
      (<V3TopbarInterface>this.container).toggleSearchBar(visible);
    }
  }
}
