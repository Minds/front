import { ChangeDetectionStrategy, Component } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { ChannelEditService } from './edit.service';
import { map } from 'rxjs/operators';
import entityToBannerUrl from '../../../../helpers/entity-to-banner-url';
import { ConfigsService } from '../../../../common/services/configs.service';

/**
 * Bio accordion pane component
 * Allows users to edit their channel's description, banner and avatar
 */
@Component({
  selector: 'm-channelEdit__bio',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'bio.component.html',
})
export class ChannelEditBioComponent {
  /**
   * Banner asset CSS URL observable
   */
  readonly bannerAssetCssUrl$: Observable<string>;

  /**
   * Avatar asset CSS URL observable
   */
  readonly avatarAssetCssUrl$: Observable<string>;

  /**
   * CDN URL
   */
  readonly cdnUrl: string;

  /**
   * Constructor. Set-up assets URL observables.
   * @param service
   * @param configs
   */
  constructor(
    public service: ChannelEditService,
    configs: ConfigsService
  ) {
    // CDN URL
    this.cdnUrl = configs.get('cdn_url');

    // Banner
    this.bannerAssetCssUrl$ = combineLatest([
      this.service.banner$,
      this.service.channel$,
    ]).pipe(
      map(([file, channel]) => {
        if (file) {
          return `url(${URL.createObjectURL(file)})`;
        } else if (channel) {
          return `url(${this.cdnUrl}${entityToBannerUrl(channel)}`;
        } else {
          return 'none';
        }
      })
    );

    // Avatar
    this.avatarAssetCssUrl$ = combineLatest([
      this.service.avatar$,
      this.service.channel$,
    ]).pipe(
      map(([file, channel]) => {
        if (file) {
          return `url(${URL.createObjectURL(file)})`;
        } else if (channel) {
          return `url(${this.cdnUrl}icon/${channel.guid}/large/${channel.icontime})`;
        } else {
          return 'none';
        }
      })
    );
  }

  /**
   * Sets the banner
   * @param fileInput
   */
  uploadBanner(fileInput: HTMLInputElement): void {
    const file = fileInput.files.item(0);

    if (!file) {
      return;
    }

    this.service.banner$.next(file);
  }

  /**
   * Sets the avatar
   * @param fileInput
   */
  uploadAvatar(fileInput: HTMLInputElement): void {
    const file = fileInput.files.item(0);

    if (!file) {
      return;
    }

    this.service.avatar$.next(file);
  }
}
