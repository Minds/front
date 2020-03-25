import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { Session } from '../../services/session';
import { ConfigsService } from '../../common/services/configs.service';

@Component({
  selector: 'm-boost__marketing',
  templateUrl: 'marketing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoostMarketingComponent {
  readonly cdnAssetsUrl: string;

  @ViewChild('topAnchor', { static: false })
  readonly topAnchor: ElementRef;

  constructor(
    protected router: Router,
    protected session: Session,
    protected cd: ChangeDetectorRef,
    private configs: ConfigsService
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }

  scrollToTop() {
    if (this.topAnchor.nativeElement) {
      this.topAnchor.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
    }
  }

  action() {
    if (!this.session.isLoggedIn()) {
      localStorage.setItem('redirect', '/boost/console/newsfeed/create');
      this.router.navigate(['/login']);
      return;
    }

    this.router.navigate(['/boost/console/newsfeed/create']);
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
