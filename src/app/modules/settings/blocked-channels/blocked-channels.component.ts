import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { BlockListService } from "../../../common/services/block-list.service";
import { EntitiesService } from "../../../common/services/entities.service";
import { Client } from "../../../services/api/client";

@Component({
  selector: 'm-settings__blockedChannels',
  templateUrl: 'blocked-channels.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsBlockedChannelsComponent implements OnInit {

  blockedGuids: any[] = [];
  channels: any[] = [];

  offset: number = 0;

  moreData: boolean = true;
  inProgress: boolean = false;

  minds = window.Minds;

  constructor(
    protected blockListService: BlockListService,
    protected entitiesService: EntitiesService,
    protected client: Client,
    protected cd: ChangeDetectorRef,
  ) {
  }

  ngOnInit() {
    this.load(true);
  }

  async load(refresh: boolean = false) {
    const limit = 24;

    if (!refresh && this.inProgress) {
      return false;
    }

    try {
      this.inProgress = true;

      if (refresh) {
        this.blockedGuids = [];
        this.channels = [];
        this.offset = 0;
        this.moreData = true;
      }

      if (!this.offset) {
        this.blockedGuids = (await this.blockListService.getList()) || [];
      }

      const next = this.offset + limit;
      const guids = this.blockedGuids.slice(this.offset, next);

      const channels = (await this.entitiesService.fetch(guids)) || [];

      if (!channels.length) {
        this.moreData = false;
      }

      this.channels.push(...channels);
      this.offset = next;
    } catch (e) {
      this.moreData = false;
    }

    this.inProgress = false;
    this.detectChanges();
  }

  getChannelIcon(channel) {
    return `${this.minds.cdn_url}icon/${channel.guid}/medium/${channel.icontime}`;
  }

  async block(channel) {
    const { guid } = channel;

    if (!guid) {
      throw new Error('Missing channel GUID');
    }

    try {
      channel._unblocked = void 0;

      await this.client.put(`api/v1/block/${guid}`, {});
      await this.blockListService.add(guid);
    } catch (e) {
      channel._unblocked = true;
      console.error(e);
    }

    this.detectChanges();
  }

  async unblock(channel) {
    const { guid } = channel;

    if (!guid) {
      throw new Error('Missing channel GUID');
    }

    try {
      channel._unblocked = true;

      await this.client.delete(`api/v1/block/${guid}`, {});
      await this.blockListService.remove(guid);
    } catch (e) {
      channel._unblocked = void 0;
      console.error(e);
    }

    this.detectChanges();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
