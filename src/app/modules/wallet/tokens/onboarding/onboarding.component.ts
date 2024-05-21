import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { Client } from '../../../../services/api/client';
import { Session } from '../../../../services/session';
import { TokenOnboardingService } from './onboarding.service';
import { DynamicHostDirective } from '../../../../common/directives/dynamic-host.directive';
import { Storage } from '../../../../services/storage';

/**
 * DEPRECATED
 */
@Component({
  selector: 'm-token--onboarding',
  templateUrl: 'onboarding.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TokenOnboardingComponent {
  @ViewChild(DynamicHostDirective, { static: true }) host;

  inProgress: boolean = false;
  error: string;

  constructor(
    protected client: Client,
    protected cd: ChangeDetectorRef,
    protected session: Session,
    protected router: Router,
    public service: TokenOnboardingService,
    protected storage: Storage
  ) {}

  ngOnInit() {
    if (
      this.storage.get('walletOnboardingComplete') ||
      (this.session.getLoggedInUser().rewards &&
        this.session.getLoggedInUser().eth_wallet)
    ) {
      return; //already onboarded
    }
    this.loadSlide();
  }

  loadSlide() {
    const viewContainerRef = this.host.viewContainerRef;
    viewContainerRef.clear();

    if (!this.service.slide) {
      return;
    }

    let componentRef = viewContainerRef.createComponent(this.service.slide);

    if (componentRef.instance.next) {
      componentRef.instance.next.subscribe((next) => {
        this.service.next();
        this.loadSlide();
        this.detectChanges();
      });
    }

    //componentRef.changeDetectorRef.markForCheck();
    //componentRef.changeDetectorRef.detectChanges();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
