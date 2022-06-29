import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ChannelsV2Service } from '../channels-v2.service';

/**
 * Pro channel button to visit a users pro channel.
 * Displayed only if this channel has a pro site.
 */
@Component({
  selector: 'm-channelActions__proChannel',
  template: `
    <m-button
      *ngIf="(service.channel$ | async)?.pro"
      class="m-button-v2 m-button-v2--transparent"
      (onAction)="navigateToProChannel()"
      overlay="true"
      color="blue"
      size="xsmall"
    >
      <ng-container i18n="Users Minds Pro channel|@@COMMON__PRO_CHANNEL">
        Pro Channel
      </ng-container>
    </m-button>
  `,
})
export class ChannelActionsProButtonComponent {
  /**
   * Constructor
   * @param Router router
   * @param ChannelsV2Service service
   */
  constructor(public router: Router, public service: ChannelsV2Service) {}

  /**
   * Navigates to the users pro channel.
   * @returns { void }
   */
  public navigateToProChannel(): void {
    this.router.navigate([`/pro/${this.service.username$.getValue()}`]);
  }
}
