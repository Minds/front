import { Component, OnInit } from '@angular/core';
import { ActivityEntity, ActivityService } from '../activity.service';
import { SiteMembershipManagementService } from '../../../site-memberships/services/site-membership-management.service';
import { SiteMembershipService } from '../../../site-memberships/services/site-memberships.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'm-activity__siteMembershipCta',
  templateUrl: './site-membership-cta.component.html',
  styleUrls: ['./site-membership-cta.component.ng.scss'],
})
export class ActivitySiteMembershipCtaComponent implements OnInit {
  isMinimalMode = this.service.displayOptions.minimalMode;
  entity: ActivityEntity;

  get isVideo(): boolean {
    return this.entity.custom_type === 'video';
  }

  constructor(
    private service: ActivityService,
    private siteMembershipService: SiteMembershipService,
    private siteMembershipManagementService: SiteMembershipManagementService
  ) {}

  ngOnInit(): void {
    this.service.entity$.subscribe(entity => (this.entity = entity));
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
