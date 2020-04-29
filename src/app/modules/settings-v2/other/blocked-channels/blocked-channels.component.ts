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

@Component({
  selector: 'm-settingsV2__blockedChannels',
  templateUrl: './blocked-channels.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsV2BlockedChannelsComponent implements OnInit {
  blockedGuids: any[] = [];
  channels;
  hasList: boolean = true;

  offset: number = 0;

  moreData: boolean = true;
  inProgress: boolean = false;
  saving: boolean = false;

  constructor(
    protected blockListService: BlockListService,
    protected entitiesService: EntitiesService,
    protected client: Client,
    protected cd: ChangeDetectorRef,
    private configs: ConfigsService,
    protected formToastService: FormToastService
  ) {}

  ngOnInit() {
    this.load(true);
    // Hydrate the channel entities from blocked guids
    this.channels = this.blockListService.blocked.pipe(
      tap(() => {
        this.inProgress = true;
        this.moreData = false; // Support pagination in the future
        this.detectChanges();
      }),
      filter(list => list.length > 0),
      switchMap(async guids => {
        const response: any = await this.entitiesService.fetch(guids);

        return response.entities;
      }),
      tap(blocked => {
        this.inProgress = false;
        this.detectChanges();
      })
    );
  }

  async load(refresh: boolean = false) {
    if (this.inProgress) return;
    this.blockListService.fetch(); // Get latest
    if (this.blockListService.blocked.value.length === 0) {
      this.hasList = false;
      this.detectChanges();
    }
  }

  loadMore() {
    // Implement soon
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
      this.formToastService.success(channel.username + ' has been unblocked');
      this.load(false);
    } catch (e) {
      channel._unblocked = void 0;
      console.error(e);
      this.formToastService.error(
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
