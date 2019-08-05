import { Component } from '@angular/core';
import { ProChannelService } from "../channel.service";

@Component({
  selector: 'm-pro--channel-footer',
  templateUrl: 'footer.component.html'
})

export class ProChannelFooterComponent {

  get footerLinks() {
    return this.channelService.currentChannel.pro_settings.footer_links;
  }

  constructor(
    private channelService: ProChannelService,
  ) {

  }
}
