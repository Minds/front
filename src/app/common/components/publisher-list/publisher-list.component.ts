import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MindsUser } from '../../../interfaces/entities';
import { MindsGroup } from '../../../modules/groups/v2/group.model';

type MindsPublisher = MindsUser | MindsGroup;

/**
 * Simple component to display a list of publishers
 * Users can remove publishers from the list
 * (which will emit an event to the parent component)
 */
@Component({
  selector: 'm-publisherList',
  templateUrl: './publisher-list.component.html',
  styleUrls: ['./publisher-list.component.ng.scss'],
})
export class PublisherListComponent {
  @Input() publishers: MindsPublisher[] = [];
  @Output() publisherRemovedAtIndex = new EventEmitter<number>();

  removePublisher(index: number): void {
    this.publisherRemovedAtIndex.emit(index);
  }

  isUser(publisher: MindsPublisher): publisher is MindsUser {
    return (publisher as MindsUser).type === 'user';
  }

  isGroup(publisher: MindsPublisher): publisher is MindsGroup {
    return (publisher as MindsGroup).type === 'group';
  }
}
