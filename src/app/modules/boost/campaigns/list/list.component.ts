import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: 'm-boost-campaigns-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'list.component.html'
})
export class BoostCampaignsListComponent {
  campaigns = [
    {
      guid: '10000000001',
      name: 'Buy me a beer',
      delivery: 'active',
      budget: 10,
      impressions: 10000,
      cpm: 1,
      max_surge: 200,
      start: 1559736000000,
      end: 1562328000000,
    },
    {
      guid: '10000000002',
      name: 'Nomad',
      delivery: 'ended',
      budget: 100,
      impressions: 100000,
      cpm: 1,
      max_surge: 0,
      start: 1558353600000,
      end: 1559476800000,
    },
  ]
}
