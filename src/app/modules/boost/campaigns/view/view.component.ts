import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: 'm-boost-campaigns-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'view.component.html',
})
export class BoostCampaignsViewComponent {}
