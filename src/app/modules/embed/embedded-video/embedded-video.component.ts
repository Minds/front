import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ConfigsService } from '../../../common/services/configs.service';
import { MetaService } from '../../../common/services/meta.service';
import { Client } from '../../../services/api/client';

/**
 * Embeddable video content for external sites.
 * (A video component built in a way so that it has no other dependencies)
 */
@Component({
  selector: 'm-embedded-video',
  templateUrl: 'embedded-video.component.html',
  styleUrls: ['embedded-video.component.ng.scss'],
})
export class EmbeddedVideoComponent implements OnInit {
  guid: string;
  title?: string;
  channelUrl?: string;
  mediaUrl?: string;
  entity: any = {};
  topVisible: boolean = true;
  autoplay: boolean = false;
  avatarSrc: string;
  paramsSubscription: Subscription;
  queryParamsSubscription: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private configs: ConfigsService,
    private metaService: MetaService,
    public client: Client
  ) {}

  ngOnInit() {
    this.queryParamsSubscription = this.activatedRoute.queryParamMap.subscribe(
      params => {
        this.autoplay = params.get('autoplay') === 'true' || false;
        this.detectChanges();
      }
    );
    this.paramsSubscription = this.activatedRoute.paramMap.subscribe(params => {
      this.guid = params.get('guid');

      /**
       * Load entity and update metadata.
       * This request must ideally be run on the
       * server side and transferred to the client
       * */
      if (this.guid) {
        this.load(this.guid);
      }
      this.detectChanges();
    });
  }

  load(guid: string) {
    this.client
      .get('api/v1/media/' + guid, { children: false })
      .then((response: any) => {
        if (response.entity.type !== 'object') {
          return;
        }

        if (response.entity) {
          this.entity = response.entity;
          this.avatarSrc = this.getAvatarSrc(response.entity.ownerObj);
          this.channelUrl =
            this.configs.get('site_url') + response.entity.ownerObj.username;
          this.mediaUrl = this.configs.get('site_url') + 'media/' + this.guid;
          this.updateMeta();
        }

        this.detectChanges();
      });
  }

  public getAvatarSrc(user: any) {
    return `${this.configs.get('cdn_url')}icon/${user.guid}/large/${
      user.icontime
    }`;
  }

  private updateMeta(): void {
    this.title =
      this.entity.title ||
      `${this.entity.ownerObj.username}'s ${this.entity.subtype}`;

    this.metaService.setTitle(this.title);
    this.metaService.setDescription(this.entity.description);
    this.metaService.setOgImage(this.entity.thumbnail_src);
  }

  onControlsShown() {
    this.topVisible = true;
  }

  onControlsHidden() {
    this.topVisible = false;
  }

  public ngOnDestroy() {
    this.queryParamsSubscription.unsubscribe();
    this.paramsSubscription.unsubscribe();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
