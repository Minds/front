import { Component, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  InteractionsModalDataService,
  InteractionType,
} from './interactions-modal-data.service';

/**
 * Displays which users completed a certain interaction (e.g. upvote, remind) on an activity post
 *
 * See it on a single page or modal of an activity that has been interacted with. Then click
 * on the trigger (e.g. "12 upvotes").
 */
@Component({
  selector: 'm-interactionsModal',
  templateUrl: './interactions-modal.component.html',
  styleUrls: ['./interactions-modal.component.ng.scss'],
  providers: [InteractionsModalDataService],
})
export class InteractionsModalComponent {
  type: InteractionType;

  entities: Array<any>;

  nextPagingToken$ = this.interactionsDataService.nextPagingToken$;
  nextPagingToken: string;
  nextPagingTokenSubscription: Subscription;

  inProgress$ = this.interactionsDataService.inProgress$;

  listSubscription: Subscription;

  constructor(private interactionsDataService: InteractionsModalDataService) {}

  ngOnInit() {
    this.listSubscription = this.interactionsDataService.list$.subscribe(
      entities => (this.entities = entities)
    );
    this.nextPagingTokenSubscription = this.interactionsDataService.nextPagingToken$.subscribe(
      nextPagingToken => (this.nextPagingToken = nextPagingToken)
    );
  }

  ngOnDestroy() {
    this.listSubscription.unsubscribe();
  }

  setModalData(data: { type: InteractionType; entityGuid: string }) {
    this.type = data.type;

    this.interactionsDataService.type$.next(data.type);
    this.interactionsDataService.entityGuid$.next(data.entityGuid);
  }

  get title(): string {
    switch (this.type) {
      case 'votes-up':
        return 'Upvotes';
      case 'votes-down':
        return 'Downvotes';
      case 'reminds':
        return 'Reminds';
      case 'quotes':
        return 'Quote posts';
      case 'subscribers':
        return 'Recent subscribers';
      case 'mutual-subscribers':
        return 'Subscribers you know';
    }
  }

  loadNext() {
    this.interactionsDataService.loadNext(this.nextPagingToken);
  }
}
