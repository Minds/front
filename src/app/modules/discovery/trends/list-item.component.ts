import { Component, Input } from '@angular/core';
import { DiscoveryTrend } from './trends.service';

@Component({
  selector: 'm-discoveryTrends__listItem',
  templateUrl: './list-item.component.html',
})
export class DiscoveryTrendsListItemComponent {
  @Input() trend: DiscoveryTrend;

  ngOnInit() {}
}
