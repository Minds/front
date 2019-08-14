import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProChannelService } from '../channel.service';
import { OverlayModalService } from '../../../../services/ux/overlay-modal';

@Component({
  selector: 'm-pro--channel-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'home.component.html',
})
export class ProChannelHomeComponent implements OnInit {

  inProgress: boolean = false;

  featuredContent: Array<any> = [];

  content: Array<any> = [];

  moreData: boolean = true;

  constructor(
    protected channelService: ProChannelService,
    protected modalService: OverlayModalService,
    protected cd: ChangeDetectorRef,
  ) {
  }

  ngOnInit() {
    this.load();
  }

  async load() {
    this.inProgress = true;
    this.featuredContent = [];
    this.content = [];
    this.moreData = true;

    this.detectChanges();

    try {
      this.featuredContent = await this.channelService.getFeaturedContent();
      this.detectChanges();

      const { content } = await this.channelService.getContent({
        limit: 24,
      });
      this.content.push(...content);
      this.detectChanges();
    } catch (e) {
      this.moreData = false;
    }

    this.inProgress = false;
    this.detectChanges();
  }

  onContentClick(entity: any) {
    return this.channelService.open(entity, this.modalService);
  }

  get settings() {
    return this.channelService.currentChannel && this.channelService.currentChannel.pro_settings;
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
