import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { Campaign } from '../campaigns.type';
import { CampaignsService } from '../campaigns.service';

@Component({
  providers: [CampaignsService],
  selector: 'm-boost-campaigns-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'list.component.html',
})
export class BoostCampaignsListComponent implements OnInit {
  campaigns: Array<Campaign> = [];

  inProgress: boolean = false;

  offset: string = '';

  moreData: boolean = true;

  constructor(
    protected service: CampaignsService,
    protected cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.load(true);
  }

  async load(refresh: boolean = false) {
    if (!refresh && this.inProgress) {
      return;
    }

    this.inProgress = true;

    if (refresh) {
      this.campaigns = [];
      this.offset = '';
      this.moreData = true;
    }

    try {
      const { campaigns, 'load-next': next } = await this.service.list({
        limit: 12,
        offset: this.offset,
      });

      this.campaigns.push(...campaigns);
      this.offset = next || '';
      this.moreData = Boolean(this.offset);
    } catch (e) {
      this.moreData = false;
    }

    this.inProgress = false;

    this.detectChanges();
  }

  getType(campaign: Campaign) {
    const type = this.service
      .getTypes()
      .find(campaignType => campaignType.id === campaign.type);
    return type ? type.label : campaign.type;
  }

  getDeliveryStatus(campaign: Campaign) {
    const deliveryStatus = this.service
      .getDeliveryStatuses()
      .find(deliveryStatus => deliveryStatus.id === campaign.delivery_status);
    return deliveryStatus ? deliveryStatus.label : campaign.delivery_status;
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
