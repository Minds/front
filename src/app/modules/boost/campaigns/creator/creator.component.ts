import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { Campaign, CampaignType } from "../campaign.type";

@Component({
  selector: 'm-boost-campaigns-creator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'creator.component.html',
})
export class BoostCampaignsCreatorComponent implements OnInit {

  campaign: Campaign;

  inProgress: boolean = false;

  ngOnInit() {
    this.reset();
  }

  getCampaignTypes(): { id: CampaignType, label: string, disabled?: boolean }[] {
    return [
      {
        id: 'newsfeed',
        label: 'Newsfeed'
      },
      {
        id: 'content',
        label: 'Content'
      },
      {
        id: 'banner',
        label: 'Banner',
        disabled: true
      },
      {
        id: 'video',
        label: 'Video',
        disabled: true
      }
    ];
  }

  reset() {
    this.campaign = {
      name: '',
      type: 'newsfeed',
      budget: 5,
      content: [],
      hashtags: '',
      start: Date.now(),
      end: Date.now() + (5 * 24 * 60 * 60 * 1000),
      max_surge: 100,
      impressions: 0,
    };

    this.calcImpressions();
  }

  calcImpressions() {
    this.campaign.impressions = (this.campaign.budget || 0) * 1000;
  }

  canSubmit() {
    return this.campaign.name &&
      this.campaign.type &&
      this.campaign.budget &&
      this.campaign.budget > 0 &&
      this.campaign.content &&
      this.campaign.content.length &&
      this.campaign.start &&
      this.campaign.end &&
      this.campaign.start <= this.campaign.end &&
      this.campaign.max_surge >= 0;
  }
}
