import { Component, HostBinding, Injector } from '@angular/core';
import { Subscription } from 'rxjs';

import {
  ActivityEntity,
  ActivityService,
} from '../../activity/activity.service';
import { Session } from '../../../../services/session';
import { Router } from '@angular/router';
import { BoostCreatorComponent } from '../../../boost/creator/creator.component';
import { BoostModalLazyService } from '../../../boost/modal/boost-modal-lazy.service';
import { FeaturesService } from '../../../../services/features.service';
import { InteractionsModalService } from '../../interactions-modal/interactions-modal.service';
import { InteractionType } from '../../interactions-modal/interactions-modal-data.service';
import { ModalService } from '../../../../services/ux/modal.service';

@Component({
  selector: 'm-activityV2__toolbar',
  templateUrl: 'toolbar.component.html',
  styleUrls: ['./toolbar.component.ng.scss'],
})
export class ActivityV2ToolbarComponent {
  private entitySubscription: Subscription;
  private paywallBadgeSubscription: Subscription;

  entity: ActivityEntity;
  allowReminds: boolean = true;

  @HostBinding('class.m-activityToolbar--single')
  get isSingle(): boolean {
    return this.service.displayOptions.isSingle;
  }

  @HostBinding('class.m-activityToolbar--modal')
  get isModal(): boolean {
    return this.service.displayOptions.isModal;
  }

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

    this.service.displayOptions.showOnlyCommentsToggle = !this.service
      .displayOptions.showOnlyCommentsToggle;
  }

  async openBoostModal(e: MouseEvent): Promise<void> {
    try {
      if (this.features.has('boost-modal-v2')) {
        await this.boostModal.open(this.entity);
        return;
      }

      this.modalService.present(BoostCreatorComponent, {
        data: {
          channel: this.entity,
        },
        injector: this.injector,
      });
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
