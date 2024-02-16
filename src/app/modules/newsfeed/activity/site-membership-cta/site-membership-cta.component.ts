import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivityEntity, ActivityService } from '../activity.service';
import { SiteMembershipManagementService } from '../../../site-memberships/services/site-membership-management.service';
import { SiteMembershipService } from '../../../site-memberships/services/site-memberships.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'm-activity__siteMembershipCta',
  templateUrl: './site-membership-cta.component.html',
  styleUrls: ['./site-membership-cta.component.ng.scss'],
})
export class ActivitySiteMembershipCtaComponent
  implements OnInit, AfterViewInit {
  isMinimalMode = this.service.displayOptions.minimalMode;
  entity: ActivityEntity;
  thumbnailHeightPx: number;

  get isVideo(): boolean {
    return this.entity.custom_type === 'video';
  }

  @ViewChild('thumbnailImgEl', { read: ElementRef })
  thumbnailImgEl: ElementRef;

  constructor(
    private service: ActivityService,
    private siteMembershipService: SiteMembershipService,
    private siteMembershipManagementService: SiteMembershipManagementService
  ) {}

  ngOnInit(): void {
    this.service.entity$.subscribe(entity => (this.entity = entity));
  }

  ngAfterViewInit(): void {
    this.calculateThumbnailHeight();
    setTimeout(() => {
      this.calculateThumbnailHeight();
    });
  }

  calculateThumbnailHeight() {
    const componentWidth = this.thumbnailImgEl.nativeElement.clientWidth;
    if (this.entity.paywall_thumbnail) {
      const originalHeight = this.entity.paywall_thumbnail.height || 10;
      const originalWidth = this.entity.paywall_thumbnail.width || 10;

      const aspectRatio = originalHeight / originalWidth;
      this.thumbnailHeightPx = componentWidth * aspectRatio;
    }
  }

  async onClick(e: MouseEvent): Promise<void> {
    await this.siteMembershipService.fetch();

    const siteMemberships = await firstValueFrom(
      this.siteMembershipService.siteMemberships$
    );

    const lowestPriceMembership = this.siteMembershipService.getLowestPriceMembershipFromArray(
      siteMemberships
    );

    this.siteMembershipManagementService.navigateToCheckout(
      lowestPriceMembership.id,
      '/newsfeed/' + this.entity.guid
    );
  }
}
