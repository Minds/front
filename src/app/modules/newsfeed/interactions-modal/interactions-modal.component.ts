import { Component, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  InteractionsModalDataService,
  InteractionType,
} from './interactions-modal-data.service';

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

  set data(data: { type: InteractionType; entityGuid: string }) {
    this.type = data.type;

    this.interactionsDataService.type$.next(data.type);
    this.interactionsDataService.entityGuid$.next(data.entityGuid);
  }

  get title(): string {
    switch (this.type) {
      case 'votes-up':
        return 'Up-Votes';
      case 'votes-down':
        return 'Down-Votes';
      case 'reminds':
        return 'Reminds';
      case 'quotes':
        return 'Quote posts';
    }
  }

  loadNext() {
    this.interactionsDataService.loadNext(this.nextPagingToken);
  }
}
