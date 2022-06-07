import { Component, Injector } from '@angular/core';
import { Subscription } from 'rxjs';

import { ActivityEntity, ActivityService } from '../activity.service';
import { Session } from '../../../../services/session';
import { Router } from '@angular/router';
import { BoostModalLazyService } from '../../../boost/modal/boost-modal-lazy.service';
import { FeaturesService } from '../../../../services/features.service';
import { InteractionsModalService } from '../../interactions-modal/interactions-modal.service';
import { InteractionType } from '../../interactions-modal/interactions-modal-data.service';
import { ModalService } from '../../../../services/ux/modal.service';

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
    private modalService: ModalService,
    private boostModal: BoostModalLazyService,
    private features: FeaturesService,
    private interactionsModalService: InteractionsModalService,
    private injector: Injector
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
      await this.boostModal.open(this.entity);
    } catch (e) {
      // do nothing.
    }
  }

  async openInteractions(type: InteractionType) {
    const guid =
      this.entity.entity_guid && type !== 'quotes' && type !== 'reminds'
        ? this.entity.entity_guid
        : this.entity.guid;
    await this.interactionsModalService.open(type, guid);
  }

  /**
   * Show the metrics bar if at least one metric has data
   **/
  get showMetrics(): boolean {
    return (
      this.entity['thumbs:up:count'] > 0 ||
      this.entity['thumbs:down:count'] > 0 ||
      this.entity?.reminds > 0 ||
      this.entity?.quotes > 0
    );
  }
}
