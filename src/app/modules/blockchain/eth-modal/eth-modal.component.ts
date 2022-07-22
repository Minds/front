import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { Session } from '../../../services/session';
import { Web3WalletService } from '../web3-wallet.service';
import isMobile from '../../../helpers/is-mobile';
import { SendWyreService } from '../sendwyre/sendwyre.service';
import { SendWyreConfig } from '../sendwyre/sendwyre.interface';
import { SiteService } from '../../../common/services/site.service';
import { ConfigsService } from '../../../common/services/configs.service';
import { ToasterService } from '../../../common/services/toaster.service';

@Component({
  selector: 'm-blockchain__eth-modal',
  templateUrl: 'eth-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlockchainEthModalComponent implements OnInit {
  @Input() rate = 1;
  @Output() close: EventEmitter<boolean> = new EventEmitter(true);

  error: string = '';
  usd: number = 40;
  hasMetamask: boolean = true; // True by default
  step: number = 1;

  constructor(
    private web3Wallet: Web3WalletService,
    private cd: ChangeDetectorRef,
    private sendWyreService: SendWyreService,
    public session: Session,
    public site: SiteService,
    private configs: ConfigsService,
    private toasterService: ToasterService
  ) {}

  ngOnInit() {
    // grab latest ETH rate
    this.detectChanges();
  }

  get ethRate(): number {
    const tokenUsdRate = 1.25;
    const tokenUsd = 1 / tokenUsdRate;
    const usd = this.rate / tokenUsd;
    return usd;
  }

  get eth(): number {
    return this.usd / this.ethRate;
  }

  setEth(eth) {
    this.usd = eth * this.ethRate;
  }

  async buy() {
    this.error = '';
    this.detectChanges();

    if (!this.session.isLoggedIn()) {
      this.toasterService.error('You must be signed up to buy ETH.');
      this.detectChanges();
      return;
    }

    if (!this.session.getLoggedInUser().rewards) {
      this.toasterService.error(
        'You must be signed up for a wallet to buy ETH.'
      );
      this.detectChanges();
      return;
    }

    if (!this.hasMetamask) {
      this.toasterService.error('You need to install metamask');
      this.detectChanges();
      return;
    }

    if (this.usd > 40) {
      this.usd = 40;
      this.toasterService.error('You can not purchase more than $40');
      this.detectChanges();
      return;
    }

    const sendWyreConfig: SendWyreConfig = {
      dest: `ethereum:${this.session.getLoggedInUser().eth_wallet}`,
      destCurrency: 'ETH',
      sourceCurrency: 'USD',
      amount: this.usd.toString(),
    };

    this.sendWyreService.redirect(sendWyreConfig);
    this.close.next(true);
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  isMobile() {
    return isMobile();
  }
}
