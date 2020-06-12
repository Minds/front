import { ChangeDetectionStrategy, Component } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { ConfigsService } from '../../../../../../common/services/configs.service';
import { map } from 'rxjs/operators';
import entityToBannerUrl from '../../../../../../helpers/entity-to-banner-url';
import { GroupEditService } from '../edit.service';

@Component({
  selector: 'm-groupEdit__description',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'description.component.html',
})
export class GroupEditDescriptionComponent {
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

  constructor(public service: GroupEditService, configs: ConfigsService) {
    // CDN URL
    this.cdnUrl = configs.get('cdn_url');

    // Banner
    this.bannerAssetCssUrl$ = combineLatest([
      this.service.banner$,
      this.service.group$,
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
      this.service.group$,
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
