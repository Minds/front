import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { tap, filter, switchMap } from 'rxjs/operators';
import { BlockListService } from '../../../common/services/block-list.service';
import { EntitiesService } from '../../../common/services/entities.service';
import { Client } from '../../../services/api/client';
import { ConfigsService } from '../../../common/services/configs.service';

@Component({
  selector: 'm-settings__blockedChannels',
  templateUrl: 'blocked-channels.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsBlockedChannelsComponent implements OnInit {
  blockedGuids: any[] = [];
  channels;

  offset: number = 0;

  moreData: boolean = true;
  inProgress: boolean = false;

  constructor(
    protected blockListService: BlockListService,
    protected entitiesService: EntitiesService,
    protected client: Client,
    protected cd: ChangeDetectorRef,
    private configs: ConfigsService
  ) {}

  ngOnInit() {
    this.load(true);
    this.channels = this.blockListService.blocked.pipe(
      tap(() => {
        this.inProgress = true;
        this.moreData = false; // Support pagination in the future
      }),
      filter(list => list.length > 0),
      switchMap(async guids => {
        const response: any = await this.entitiesService.fetch(guids);
        return response.entities;
      }),
      tap(blocked => {
        this.inProgress = false;
      })
    );
  }

  async load(refresh: boolean = false) {
    if (this.inProgress) return;
    this.blockListService.fetch(); // Get latest
  }

  loadMore() {
    // Implement soon
  }

  getChannelIcon(channel) {
    return `${this.configs.get('cdn_url')}icon/${channel.guid}/medium/${
      channel.icontime
    }`;
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
