import { Component, OnDestroy } from '@angular/core';
import { Session } from '../../../services/session';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '../../../services/storage';
import { OnboardingV2Service } from '../service/onboarding.service';
import { V2TopbarService } from '../../../common/layout/v2-topbar/v2-topbar.service';
import { SidebarMarkersService } from '../../../common/layout/sidebar/markers.service';

@Component({
  selector: 'm-onboarding',
  templateUrl: 'onboarding.component.html',
})
export class OnboardingComponent implements OnDestroy {
  steps = [
    {
      name: 'Hashtags',
      selected: false,
    },
    {
      name: 'Info',
      selected: false,
    },
    {
      name: 'Groups',
      selected: false,
    },
    {
      name: 'Channels',
      selected: false,
    },
  ];
  showTitle: boolean = false;
  shown: boolean = false;

  constructor(
    private session: Session,
    private router: Router,
    private storage: Storage,
    private route: ActivatedRoute,
    private onboardingService: OnboardingV2Service,
    private topbarService: V2TopbarService,
    private sidebarMarkersService: SidebarMarkersService
  ) {
    route.url.subscribe(() => {
      const section: string = route.snapshot.firstChild.routeConfig.path;
      if (section === 'notice') {
        this.showTitle = false;
      } else {
        if (!this.shown) {
          this.shown = true;
          this.onboardingService.shown();
        }
        this.showTitle = true;

        for (const item of this.steps) {
          item.selected = item.name.toLowerCase() === section;
        }
        this.steps = this.steps.slice(0);
      }
    });

    if (!this.session.isLoggedIn()) {
      this.storage.set('redirect', 'onboarding');
      this.router.navigate(['/register']);
      return;
    }

    this.checkIfAlreadyOnboarded();
  }

  ngOnDestroy() {
    this.topbarService.toggleVisibility(true);
    this.sidebarMarkersService.toggleVisibility(true);
  }

  async checkIfAlreadyOnboarded() {
    if (!(await this.onboardingService.shouldShow())) {
      this.router.navigate(['/newsfeed/subscriptions']);
    }

    this.topbarService.toggleVisibility(false);
    this.sidebarMarkersService.toggleVisibility(false);
  }
}
