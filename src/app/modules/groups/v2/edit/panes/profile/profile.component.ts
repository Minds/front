import { ChangeDetectionStrategy, Component } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GroupEditService } from '../../edit.service';
import { ConfigsService } from '../../../../../../common/services/configs.service';
import entityToBannerUrl from '../../../../../../helpers/entity-to-banner-url';

/**
 * Profile pane for the edit accordion
 * Allows users to edit their group's name description, banner and avatar
 */
@Component({
  selector: 'm-groupEdit__profile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'profile.component.html',
  styleUrls: ['profile.component.ng.scss'],
})
export class GroupEditProfileComponent {
  public maxNameLength: number;
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
    public service: GroupEditService,
    configs: ConfigsService
  ) {
    // CDN URL
    this.cdnUrl = configs.get('cdn_url');
    this.maxNameLength = configs.get('max_name_length') ?? 50;

    // Banner
    this.bannerAssetCssUrl$ = combineLatest([
      this.service.banner$,
      this.service.group$,
    ]).pipe(
      map(([file, group]) => {
        if (file) {
          return `url(${URL.createObjectURL(file)})`;
        } else if (group) {
          return `url(${this.cdnUrl}${entityToBannerUrl(group)}`;
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
      map(([file, group]) => {
        if (file) {
          return `url(${URL.createObjectURL(file)})`;
        } else if (group) {
          return `url(${this.cdnUrl}fs/v1/avatars/${group.guid}/large/${group.icontime})`;
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
