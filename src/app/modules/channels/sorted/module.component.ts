import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { SortedService } from './sorted.service';
import { AttachmentService } from '../../../services/attachment';

@Component({
  selector: 'm-channels--sorted-module',
  providers: [SortedService],
  templateUrl: 'module.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'mdl-card m-border',
    '[hidden]': '!entities || !entities.length',
  },
})
export class ChannelSortedModuleComponent implements OnInit {
  channel: any;
  @Input('channel') set _channel(channel: any) {
    if (channel === this.channel) {
      return;
    }

    this.channel = channel;
    this.load();
  }

  type: string = '';
  @Input('type') set _type(type: string) {
    if (type === this.type) {
      return;
    }

    this.type = type;
  }

  @Input() title: string = '';

  @Input() linksTo: string | any[];

  @Input() size: number = 3;

  entities: any[] = [];
  inProgress: boolean = false;

  constructor(
    protected service: SortedService,
    protected attachmentService: AttachmentService,
    protected cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.load();
  }

  async load() {
    if (!this.type || !this.channel) {
      return;
    }

    this.entities = [];
    this.inProgress = true;

    this.detectChanges();

    try {
      const params: any = {
        customType: this.type,
        container_guid: this.channel.guid,
        limit: this.size,
      };

      const entities = await this.service.getMedia(
        this.channel,
        this.type,
        this.size
      );

      if (!entities || !entities.length) {
        this.inProgress = false;
        this.detectChanges();

        return false;
      }

      this.entities = entities;
    } catch (e) {
      console.error('ChannelSortedModuleComponent.load', e);
    }

    this.inProgress = false;
    this.detectChanges();
  }

  shouldBeBlurred(entity: any) {
    return this.attachmentService.shouldBeBlurred(entity);
  }

  getThumbnailSrcCssUrl(entity: any) {
    let src: string = '';

    if (entity && entity.thumbnail_src) {
      src = entity.thumbnail_src;
    } else if (
      entity &&
      entity.custom_data &&
      entity.custom_data[0] &&
      entity.custom_data[0].src
    ) {
      src = entity.custom_data[0].src;
    } else if (
      entity &&
      entity.custom_data &&
      entity.custom_data.thumbnail_src
    ) {
      src = entity.custom_data.thumbnail_src;
    }

    return src ? `url(${src})` : 'none';
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
