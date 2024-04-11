import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GroupNode } from '../../../../../../../../../graphql/generated.engine';

/**
 * Groups list component, for displaying groups in the network admin
 * monetization console.
 */
@Component({
  selector: 'm-networkAdminMonetization__groupsList',
  templateUrl: './groups-list.component.html',
  styleUrls: ['./groups-list.component.ng.scss'],
})
export class NetworkAdminMonetizationGroupsListComponent {
  /** Groups to be displayed. */
  @Input() public groups: GroupNode[];

  /** Whether delete button should be shown. */
  @Input() public showDeleteButton: boolean = false;

  /** Fired on delete click */
  @Output('onDeleteClick')
  public onDeleteClickEmitter: EventEmitter<GroupNode> =
    new EventEmitter<GroupNode>();
}
