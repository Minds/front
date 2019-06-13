import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { Campaign } from '../campaigns.type';
import { ActivatedRoute } from '@angular/router';
import { CampaignsService } from '../campaigns.service';
import { Subscription } from 'rxjs';

@Component({
  providers: [CampaignsService],
  selector: 'm-boost-campaigns-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'view.component.html',
})
export class BoostCampaignsViewComponent implements OnInit, OnDestroy {

  urn: string = '';

  campaign: Campaign;

  inProgress: boolean = false;

  protected route$: Subscription;

  constructor(
    protected route: ActivatedRoute,
    protected service: CampaignsService,
    protected cd: ChangeDetectorRef,
  ) {
  }

  ngOnInit() {
    this.route$ = this.route.params.subscribe(params => {
      if (params.urn) {
        this.urn = params.urn;
        this.load();
      }
    });
  }

  ngOnDestroy() {
    this.route$.unsubscribe();
  }

  async load() {
    if (!this.urn) {
      this.campaign = void 0;
      this.detectChanges();
      return;
    }

    this.campaign = void 0;
    this.inProgress = true;
    this.detectChanges();

    try {
      const campaign = await this.service.get(this.urn);

      this.campaign = campaign;
    } catch (e) {
      console.error('BoostCampaignsViewComponent', e);

      this.campaign = void 0;
    }

    this.inProgress = false;

    this.detectChanges();
  }

  getCampaignType() {
    const campaignType = this.service.getCampaignTypes().find(campaignType => campaignType.id === this.campaign.type);
    return campaignType ? campaignType.label : this.campaign.type;
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
