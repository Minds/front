import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { Campaign } from "../campaigns.type";
import { CampaignsService } from '../campaigns.service';
import { Subscription } from 'rxjs';

@Component({
  providers: [CampaignsService],
  selector: 'm-boost-campaigns-creator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'creator.component.html',
})
export class BoostCampaignsCreatorComponent implements OnInit, OnDestroy {

  isEditing: boolean = false;

  urn: string;

  campaign: Campaign;

  inProgress: boolean = false;

  protected route$: Subscription;

  constructor(
    protected service: CampaignsService,
    protected route: ActivatedRoute,
    protected cd: ChangeDetectorRef,
  ) {
  }

  ngOnInit() {
    this.reset();

    this.route$ = this.route.params.subscribe(params => {
      if (params.urn && this.urn !== params.urn) {
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
      this.isEditing = false;
      this.reset();
      this.detectChanges();
      return;
    }

    this.isEditing = true;
    this.campaign = void 0;
    this.inProgress = true;
    this.detectChanges();

    try {
      const campaign = await this.service.get(this.urn);

      this.campaign = campaign;
    } catch (e) {
      console.error('BoostCampaignsCreatorComponent', e);
      // TODO: Add error UX
      this.campaign = void 0;
    }

    this.inProgress = false;

    this.detectChanges();
  }

  reset() {
    this.campaign = {
      name: '',
      type: 'newsfeed',
      budget: 5,
      entity_urns: [],
      hashtags: '',
      start: Date.now(),
      end: Date.now() + (5 * 24 * 60 * 60 * 1000),
      impressions: 0,
    };

    this.calcImpressions();
  }

  calcImpressions() {
    this.campaign.impressions = (this.campaign.budget || 0) * 1000;
  }

  canSubmit() {
    return this.campaign &&
      this.campaign.name &&
      this.campaign.type &&
      this.campaign.budget &&
      this.campaign.budget > 0 &&
      this.campaign.entity_urns &&
      this.campaign.entity_urns.length &&
      this.campaign.start &&
      this.campaign.end &&
      this.campaign.start <= this.campaign.end;
  }

  get types() {
    return this.service.getTypes();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
