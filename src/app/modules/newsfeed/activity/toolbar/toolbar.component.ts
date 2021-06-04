import { Component } from '@angular/core';
import { Subscription } from 'rxjs';

import { ActivityService, ActivityEntity } from '../activity.service';
import { Session } from '../../../../services/session';
import { Router } from '@angular/router';
import { BoostCreatorComponent } from '../../../boost/creator/creator.component';
import { OverlayModalService } from '../../../../services/ux/overlay-modal';
import { StackableModalService } from '../../../../services/ux/stackable-modal.service';
import { BoostModalLazyService } from '../../../boost/modal/boost-modal-lazy.service';
import { FeaturesService } from '../../../../services/features.service';
import { InteractionsModalService } from '../../interactions-modal/interactions-modal.service';
import { InteractionType } from '../../interactions-modal/interactions-modal-data.service';

@Component({
  selector: 'm-activity__toolbar',
  templateUrl: 'toolbar.component.html',
  styleUrls: ['./toolbar.component.ng.scss'],
})
export class ActivityToolbarComponent {
  private entitySubscription: Subscription;
  private paywallBadgeSubscription: Subscription;

  entity: ActivityEntity;
  allowReminds: boolean = true;

  constructor(
    public service: ActivityService,
    public session: Session,
    private router: Router,
    private overlayModalService: OverlayModalService,
    private stackableModal: StackableModalService,
    private boostModal: BoostModalLazyService,
    private features: FeaturesService,
    private interactionsModalService: InteractionsModalService
  ) {}

  ngOnInit() {
    this.entitySubscription = this.service.entity$.subscribe(
      (entity: ActivityEntity) => {
        this.entity = entity;
      }
    );

    this.paywallBadgeSubscription = this.service.shouldShowPaywallBadge$.subscribe(
      (showBadge: boolean) => {
        // this.allowReminds = !showBadge;
      }
    );
  }

  ngOnDestroy() {
    this.entitySubscription.unsubscribe();
    this.paywallBadgeSubscription.unsubscribe();
  }

  toggleComments(): void {
    if (this.service.displayOptions.fixedHeight) {
      this.router.navigate([`/newsfeed/${this.entity.guid}`]);
      return;
    }

    this.service.displayOptions.showOnlyCommentsInput = !this.service
      .displayOptions.showOnlyCommentsInput;
  }

  async openBoostModal(e: MouseEvent): Promise<void> {
    try {
      if (this.features.has('boost-modal-v2')) {
        await this.boostModal.open(this.entity);
        return;
      }

      await this.stackableModal
        .present(BoostCreatorComponent, this.entity)
        .toPromise();
    } catch (e) {
      // do nothing.
    }
  }

  async openInteractions(type: InteractionType) {
    const guid =
      this.entity.entity_guid && type !== 'quotes'
        ? this.entity.entity_guid
        : this.entity.guid;
    await this.interactionsModalService.open(type, guid);
  }
}
