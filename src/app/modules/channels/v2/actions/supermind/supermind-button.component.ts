import { Component, Injector } from '@angular/core';
import { ComposerModalService } from '../../../../composer/components/modal/modal.service';
import { ComposerService } from '../../../../composer/services/composer.service';
import { SupermindExperimentService } from '../../../../experiments/sub-services/supermind-experiment.service';
import { ChannelsV2Service } from '../../channels-v2.service';

@Component({
  selector: 'm-channelActions__supermind',
  templateUrl: './supermind-button.component.html',
  styleUrls: ['./supermind-button.component.ng.scss'],
})
export class ChannelActionsSuperminButtonComponent {
  /**
   * Determines if you can show the supermind button
   */
  canShow: boolean;

  constructor(
    private composerModalService: ComposerModalService,
    private composerService: ComposerService,
    public service: ChannelsV2Service,
    private supermindExperiment: SupermindExperimentService,
    private injector: Injector
  ) {}

  ngOnInit() {
    this.canShow = this.supermindExperiment.isActive();
  }

  /**
   * Open the composer with prefilled supermind data
   * @param e
   */
  onClick(e: MouseEvent) {
    this.composerService.supermindRequest$.next({
      receiver_guid: this.service.channel$.getValue().username,
      reply_type: 0,
      payment_options: {
        payment_type: 0,
        amount: 10,
      },
      twitter_required: false,
      terms_agreed: false,
    });

    this.composerModalService.setInjector(this.injector).present();
  }
}
