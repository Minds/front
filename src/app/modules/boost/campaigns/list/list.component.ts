import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { Campaign } from '../campaigns.type';
import { CampaignsService } from '../campaigns.service';

@Component({
  providers: [CampaignsService],
  selector: 'm-boost-campaigns-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'list.component.html'
})
export class BoostCampaignsListComponent implements OnInit {

  campaigns: Array<Campaign> = [];

  inProgress: boolean = false;

  offset: string = '';

  moreData: boolean = true;

  constructor(
    protected service: CampaignsService,
    protected cd: ChangeDetectorRef,
  ) {
  }

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
      const {campaigns, 'load-next': next} = await this.service.list({
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

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
