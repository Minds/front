import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit,
  ViewChild
} from '@angular/core';
import { Client } from '../../../services/api/client';
import { MindsTitle } from '../../../services/ux/title';
import { WireCreatorComponent } from '../../wire/creator/creator.component';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { BlockchainTdeBuyComponent } from '../tde-buy/tde-buy.component';

@Component({
  moduleId: module.id,
  selector: 'm-blockchain--marketing',
  templateUrl: 'marketing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlockchainMarketingComponent implements OnInit, OnDestroy {

  tdeStats: { tokens, raised, remaining };

  isPledgeApproved: boolean = false;
  inProgress: boolean = false;

  minds = window.Minds;

  private _pollTimer;

  videoError: boolean = false;

  constructor(
    protected client: Client,
    protected changeDetectorRef: ChangeDetectorRef,
    protected title: MindsTitle,
    protected overlayModal: OverlayModalService
  ) { }

  ngOnInit() {
    //this.poll();

    this.title.setTitle('The Minds Token');
    this.updatePledgeConfirmation();
  }

  async poll() {
    const update = async () => {
      try {
        let result: any = await this.client.get(`api/v2/blockchain/tde/stats`);

        this.tdeStats = result.stats;
        this.detectChanges();
      } catch (e) {
        console.error('[TDE Stats]', e);
      }
    };

    this._pollTimer = setInterval(update, 60 * 1000);
    update();
  }

  async updatePledgeConfirmation() {
    this.inProgress = true;
    this.detectChanges();

    try {
      const response: any = await this.client.get('api/v2/blockchain/pledges', { brief: 1 });

      this.isPledgeApproved = response.pledge && response.pledge.status === 'approved';
    } catch (e) {
      console.error(e);
    }

    this.inProgress = false;
    this.detectChanges();
  }

  ngOnDestroy() {
    if (this._pollTimer) {
      clearInterval(this._pollTimer);
    }
  }

  detectChanges() {
    this.changeDetectorRef.markForCheck();
    this.changeDetectorRef.detectChanges();
  }

  showBuy() {
    const creator = this.overlayModal.create(BlockchainTdeBuyComponent, {}, {
      onComplete: (payload: any = {}) => {
        if (payload.changeAmount) {
          this.isPledgeApproved = false;
          this.detectChanges();
        }
      }
    });
    creator.present();
  }

  /**
   * When the video source's got an error
   */
  onSourceError() {
    this.videoError = true;
  }
}
