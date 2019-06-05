import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MindsTitle } from "../../../services/ux/title";

@Component({
  selector: 'm-boost-campaigns',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'campaigns.component.html'
})
export class BoostCampaignsComponent {
  constructor(
    title: MindsTitle
  ) {
    title.setTitle('Boost Campaigns');
  }
}
