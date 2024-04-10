import { Component, Input, OnInit } from '@angular/core';
import { MindsGroup } from '../../../../groups/v2/group.model';

/**
 * Displays a 'summary' of an array of groups
 * i.e. a single featured group
 * along with a count of additional groups
 *
 * Optional: content projected action button
 */
@Component({
  selector: 'm-group__aggregator',
  templateUrl: './group-aggregator.component.html',
  styleUrls: ['./group-aggregator.component.ng.scss'],
})
export class GroupAggregatorComponent implements OnInit {
  @Input() groups: any[];

  protected featuredGroup: any;

  protected aggregatedGroups: any[];

  protected aggregatedGroupHoverText: string = '';

  ngOnInit(): void {
    this.featuredGroup = this.groups[0];
    this.aggregatedGroups = this.groups.slice(1);

    this.getAggregatedGroupHoverText();
  }

  /**
   * Show this text when user hovers over additional group aggregation
   */
  private getAggregatedGroupHoverText(): void {
    if (this.aggregatedGroups.length === 0) {
      return;
    }

    const groupNames = this.groups.slice(1).map((group) => group.legacy.name);

    this.aggregatedGroupHoverText = groupNames.join(', ');
  }
}
