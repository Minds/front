import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  Input,
  OnInit,
} from '@angular/core';
import { ActivityEntity, ActivityService } from '../activity.service';
import { WINDOW } from '../../../../common/injection-tokens/common-injection-tokens';

@Component({
  selector: 'm-activity__siteMembershipCta',
  templateUrl: './site-membership-cta.component.html',
  styleUrls: ['./site-membership-cta.component.ng.scss'],
})
export class ActivitySiteMembershipCtaComponent
  implements OnInit, AfterViewInit
{
  /** Whether the button should be shown,
   * e.g. false on the left side of a media modal,
   * b/c button is already shown on right side
   */
  @Input() showButton: boolean = true;

  isMinimalMode = this.service.displayOptions.minimalMode;
  entity: ActivityEntity;
  thumbnailHeightPx: number;
  inProgress = false;

  get isVideo(): boolean {
    return this.entity.custom_type === 'video';
  }

  constructor(
    private service: ActivityService,
    private el: ElementRef,
    @Inject(WINDOW) private window: Window
  ) {}

  ngOnInit(): void {
    this.service.entity$.subscribe((entity) => {
      this.entity = entity;
      this.calculateThumbnailHeight();
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.calculateThumbnailHeight();
    });
  }

  /**
   * Calculate the height of the thumbnail to prevent jumpiness throughout the feeds
   */
  calculateThumbnailHeight() {
    const componentWidth = this.el.nativeElement.clientWidth;
    if (this.entity?.paywall_thumbnail) {
      const originalHeight = this.entity.paywall_thumbnail.height || 10;
      const originalWidth = this.entity.paywall_thumbnail.width || 10;

      const aspectRatio = originalHeight / originalWidth;
      this.thumbnailHeightPx = componentWidth * aspectRatio;
    }
  }

  /**
   * Redirects to the checkout flow
   */
  async onClick(e: MouseEvent): Promise<void> {
    this.inProgress = true;

    this.window.open(
      `/api/v3/payments/site-memberships/paywalled-entities/${this.entity.guid}/checkout?redirectPath=/newsfeed/${this.entity.guid}`,
      '_self'
    );
  }
}
