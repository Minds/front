import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { tap, filter, switchMap } from 'rxjs/operators';
import { BlockListService } from '../../../../common/services/block-list.service';
import { EntitiesService } from '../../../../common/services/entities.service';
import { Client } from '../../../../services/api/client';
import { ConfigsService } from '../../../../common/services/configs.service';
import { FormToastService } from '../../../../common/services/form-toast.service';

/**
 * Settings page for managing a list of blocked channels
 */
@Component({
  selector: 'm-settingsV2__blockedChannels',
  templateUrl: './blocked-channels.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsV2BlockedChannelsComponent implements OnInit {
  channels;
  hasList: boolean = true;

  offset: string = '';

  moreData: boolean = true;
  inProgress: boolean = false;
  saving: boolean = false;

  constructor(
    protected blockListService: BlockListService,
    protected entitiesService: EntitiesService,
    protected client: Client,
    protected cd: ChangeDetectorRef,
    private configs: ConfigsService,
    protected toasterService: FormToastService
  ) {}

  ngOnInit() {
    this.load(true);
  }

  async load(refresh: boolean = false) {
    if (this.inProgress) return;
    if (refresh) {
      this.channels = [];
      this.offset = '';
      this.detectChanges();
    }

    this.inProgress = true;

    const response: any = await this.blockListService.getList(12, this.offset);
    this.offset = response['load-next'];
    for (let i in response.entities) {
      this.channels.push(response.entities[i]);
    }

    this.inProgress = false;

    if (!this.offset) {
      this.moreData = false;
    }

    this.detectChanges();
  }

  loadMore() {
    if (!this.moreData) {
      return;
    }
    this.load();
  }

  getChannelIcon(channel) {
    return `${this.configs.get('cdn_url')}icon/${channel.guid}/medium/${
      channel.icontime
    }`;
  }

  async unblock(channel) {
    channel._saving = true;
    this.detectChanges();
    const { guid } = channel;

    if (!guid) {
      throw new Error('Missing channel GUID');
    }

    try {
      channel._unblocked = true;

      await this.client.delete(`api/v1/block/${guid}`, {});
      await this.blockListService.remove(guid);
      this.toasterService.success(channel.username + ' has been unblocked');
      this.load(true);
    } catch (e) {
      channel._unblocked = void 0;
      console.error(e);
      this.toasterService.error(
        'An error occured while attempting to unblock ' + channel.username
      );
    }
    channel._saving = false;

    this.detectChanges();
  }

  // async block(channel) {
  //   channel._saving = true;
  //   this.detectChanges();
  //   const { guid } = channel;

  //   if (!guid) {
  //     throw new Error('Missing channel GUID');
  //   }

  //   try {
  //     channel._unblocked = void 0;

  //     await this.client.put(`api/v1/block/${guid}`, {});
  //     await this.blockListService.add(guid);
  //   } catch (e) {
  //     channel._unblocked = true;
  //     console.error(e);
  //   }
  //   channel._saving = false;
  //   this.detectChanges();
  // }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
