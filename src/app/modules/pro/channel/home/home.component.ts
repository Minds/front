import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProChannelService } from '../channel.service';

@Component({
  selector: 'm-pro--channel-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'home.component.html',
})
export class ProChannelHomeComponent implements OnInit {

  featuredContent: Array<any> = [];

  constructor(
    protected channelService: ProChannelService,
    protected cd: ChangeDetectorRef,
  ) {
  }

  ngOnInit() {
    this.channelService.setChildParams({});
    this.load();
  }

  async load() {
    this.featuredContent = await this.channelService.getFeaturedContent();
    this.detectChanges();
  }

  onFeaturedContentClick(entity) {

  }

  get settings() {
    return this.channelService.currentChannel && this.channelService.currentChannel.pro_settings;
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
