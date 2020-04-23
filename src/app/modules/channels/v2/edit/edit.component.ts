import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FeaturesService } from '../../../../services/features.service';
import { MindsUser } from '../../../../interfaces/entities';
import { ChannelEditService } from './edit.service';
import { combineLatest, Observable } from 'rxjs';
import { ConfigsService } from '../../../../common/services/configs.service';
import { map } from 'rxjs/operators';
import entityToBannerUrl from '../../../../helpers/entity-to-banner-url';

@Component({
  selector: 'm-channel__edit',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'edit.component.html',
  providers: [ChannelEditService],
})
export class ChannelEditComponent {
  /**
   * Sets the channel to be edited
   * @param channel
   */
  @Input('channel') set data(channel: MindsUser) {
    this.service.setChannel(channel);
  }

  /**
   * Modal options
   *
   * @param onSave
   * @param onDismissIntent
   */
  set opts({ onSave, onDismissIntent }) {
    this.onSave = onSave || (() => {});
    this.onDismissIntent = onDismissIntent || (() => {});
  }

  /**
   * Modal save handler
   */
  onSave: (any) => any = () => {};

  /**
   * Modal dismiss intent handler
   */
  onDismissIntent: () => void = () => {};

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
   * Constructor
   * @param service
   * @param features
   * @param configs
   */
  constructor(
    public service: ChannelEditService,
    protected features: FeaturesService,
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
   * Gets Pro settings URL
   * @param channel
   */
  getProSettingsRouterLink(channel: MindsUser): Array<any> {
    if (!channel) {
      return [];
    }

    if (!this.features.has('navigation')) {
      return ['/pro', channel.username, 'settings'];
    }

    return ['/settings/canary/pro_canary', channel.username];
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

  /**
   * Saves the updated user info
   */
  async onSubmit(): Promise<void> {
    const channel = await this.service.save();

    if (channel) {
      this.onSave(channel);
    }
  }
}
