import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, ViewChild } from '@angular/core';
import { ProChannelService } from '../channel.service';
import { FeedsService } from '../../../../common/services/feeds.service';
import { ProContentModalComponent } from '../content-modal/modal.component';
import { OverlayModalService } from '../../../../services/ux/overlay-modal';
import { OverlayModalComponent } from '../../../../common/components/overlay-modal/overlay-modal.component';

@Component({
  selector: 'm-pro--channel-list-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'list-modal.component.html',
  providers: [FeedsService, OverlayModalService],
})
export class ProChannelListModal {

  type: string;

  algorithm: string;

  query: string;

  parent: HTMLDivElement;

  @ViewChild('overlayModal', { static: true }) protected overlayModal: OverlayModalComponent;

  set data({ type, query }) {
    this.type = type;
    this.query = query;
  }

  constructor(
    protected channelService: ProChannelService,
    protected feedsService: FeedsService,
    protected modalService: OverlayModalService,
    protected cd: ChangeDetectorRef,
    protected injector: Injector,
  ) {
  }

  ngAfterViewInit() {
    this.modalService.setContainer(this.overlayModal);

    this.load(true);
  }

  async load(refresh: boolean = false) {
    if (refresh) {
      this.feedsService.clear();
    }

    this.detectChanges();

    try {
      this.feedsService
        .setEndpoint(`api/v2/feeds/channel/${this.channelService.currentChannel.guid}/${this.type}/${this.algorithm}`)
        .setLimit(12)
        .fetch();

    } catch (e) {
      console.error('ProChannelListModal.load', e);
    }
  }

  get entities$() {
    return this.feedsService.feed;
  }

  get hasMore$() {
    return this.feedsService.hasMore;
  }

  get inProgress$() {
    return this.feedsService.inProgress;
  }

  loadMore() {
    this.feedsService.loadMore();
  }

  async expand(entity) {
    switch (this.getType(entity)) {
      case 'object:blog':
        window.open(`${window.Minds.site_url}${entity.route}/`, '_blank');
        break;
      case 'object:image':
      case 'object:video':
        this.modalService.create(ProContentModalComponent, entity, {
          class: 'm-overlayModal--media'
        }, this.injector).present();
        break;
    }
  }

  private getType(entity: any) {
    return entity.type === 'object' ? `${entity.type}:${entity.subtype}` : entity.type;
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
