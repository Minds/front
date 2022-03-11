import {
  ChangeDetectionStrategy,
  Component,
  ChangeDetectorRef,
  OnInit,
  HostListener,
  Injector,
  SkipSelf,
} from '@angular/core';
import { ConfigsService } from '../../common/services/configs.service';
import { HelpdeskRedirectService } from '../../common/services/helpdesk-redirect.service';

@Component({
  selector: 'm-marketing__footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'footer.component.html',
  styleUrls: ['footer.component.ng.scss'],
})
export class MarketingFooterComponent {
  readonly year: number = new Date().getFullYear();

  readonly cdnAssetsUrl: string;

  constructor(
    private configs: ConfigsService,
    protected cd: ChangeDetectorRef,
    @SkipSelf() private injector: Injector,
    private helpdeskRedirectService: HelpdeskRedirectService
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }

  /**
   * Get helpdesk redirect URL from service.
   * @returns { string } URL to redirect to for helpdesk.
   */
  public getHelpdeskRedirectUrl(): string {
    return this.helpdeskRedirectService.getUrl();
  }
}
