/**
 * @author Emi & Ben
 * @desc Component for pro user avatar.
 *  Will display custom_logo if available, else displays user avatar.
 */
import { Component, Input } from '@angular/core';
import { MindsUser } from '../../../interfaces/entities';
import { ProChannelService } from '../channel/channel.service';

@Component({
  selector: 'm-pro--avatar',
  template: `
    <ng-container *ngIf="!hasLogo(); else customLogo">
      <minds-avatar
        class="m-proChannelTopbar__logo"
        [object]="channel"
        [routerLink]="homeRouterLink"
      ></minds-avatar>
    </ng-container>
    <ng-template #customLogo>
      <img
        class="m-proChannelTopbar__logo"
        [src]="logo"
        [routerLink]="homeRouterLink"
      />
    </ng-template>
  `,
})
export class MindsProAvatarComponent {
  // MindsUser object for avatar
  @Input() channel: MindsUser;

  constructor(protected channelService: ProChannelService) {}

  get logo(): string {
    return this.channel.pro_settings.logo_image;
  }

  get homeRouterLink(): any[] {
    return this.channelService.getRouterLink('home');
  }

  /**
   * Returns whether the channel has a logo set.
   * @returns true if logo is set.
   */
  hasLogo(): boolean {
    try {
      return (
        this.channel.pro_settings.has_custom_logo &&
        Boolean(this.channel.pro_settings.logo_image)
      );
    } catch (e) {
      return false;
    }
  }
}
