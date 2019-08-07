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
    this.load();
  }

  async load() {
    this.featuredContent = await this.channelService.getFeaturedContent();
    this.detectChanges();
  }

  onFeaturedContentClick(entity) {

  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
