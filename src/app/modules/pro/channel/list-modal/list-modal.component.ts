import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Injector, ViewChild } from '@angular/core';
import { ProChannelService } from '../channel.service';
import { FeedsService } from '../../../../common/services/feeds.service';
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

  hashtag: string;

  parent: HTMLDivElement;

  @ViewChild('overlayModal', { static: true }) protected overlayModal: OverlayModalComponent;

  set data({ type, query, hashtag }) {
    this.type = type;
    this.query = query;
    this.hashtag = hashtag;
  }

  constructor(
    protected channelService: ProChannelService,
    protected feedsService: FeedsService,
    protected modalService: OverlayModalService,
    protected element: ElementRef,
    protected cd: ChangeDetectorRef,
    protected injector: Injector,
  ) {
  }

  ngAfterViewInit() {
    this.modalService
      .setContainer(this.overlayModal)
      .setRoot(this.element.nativeElement);

    this.load(true);
  }

  async load(refresh: boolean = false) {
    if (refresh) {
      this.feedsService.clear();
    }

    this.detectChanges();

    let url = `api/v2/feeds/channel/${this.channelService.currentChannel.guid}/${this.type}/${this.algorithm}`;

    let params = [];

    if (this.query && this.query !== '') {
      params.push(`query=${this.query}`);
    }

    if (this.hashtag && this.hashtag !== 'all') {
      params.push(`hashtags=${this.hashtag}`);
    }

    if (params.length > 0) {
      url += '?' + params.join('&');
    }


    try {
      this.feedsService
        .setEndpoint(url)
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

  expand(entity: any) {
    return this.channelService.open(entity, this.modalService);
  }

  private getType(entity: any) {
    return entity.type === 'object' ? `${entity.type}:${entity.subtype}` : entity.type;
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
