import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BlockchainEthModalComponent } from './eth-modal.component';
import { MockService, MockComponent } from '../../../utils/mock';
import { Web3WalletService } from '../web3-wallet.service';
import { ChangeDetectorRef } from '@angular/core';
import { SendWyreService } from '../sendwyre/sendwyre.service';
import { sessionMock } from '../../../../tests/session-mock.spec';
import { SiteService } from '../../../common/services/site.service';
import { Session } from '../../../services/session';
import { ConfigsService } from '../../../common/services/configs.service';
import { ToasterService } from '../../../common/services/toaster.service';
import { ButtonComponent } from '../../../common/components/button/button.component';
import { siteServiceMock } from '../../../mocks/services/site-service-mock.spec';

describe('BlockchainEthModalComponent', () => {
  let comp: BlockchainEthModalComponent;
  let fixture: ComponentFixture<BlockchainEthModalComponent>;
  const sendWyreMock: any = MockService(SendWyreService);
  const configsServiceMock: any = MockService(ConfigsService, {
    get: () => {
      return {
        baseUrl: 'https://pay.sendwyre.com/',
        accountId: 'AC_123',
      };
    },
  });

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          BlockchainEthModalComponent,
          ButtonComponent,
          MockComponent({
            selector: 'm-modal',
            inputs: [],
          }),
          MockComponent({
            selector: 'input',
            inputs: ['ngModel'],
          }),
        ],
        providers: [
          {
            provide: Web3WalletService,
            useValue: MockService(Web3WalletService),
          },
          {
            provide: ChangeDetectorRef,
            useValue: MockService(ChangeDetectorRef),
          },
          {
            provide: SendWyreService,
            useValue: sendWyreMock,
          },
          {
            provide: Session,
            useValue: sessionMock,
          },
          {
            provide: SiteService,
            useValue: siteServiceMock,
          },
          {
            provide: ConfigsService,
            useValue: configsServiceMock,
          },
          {
            provide: ToasterService,
            useValue: MockService(ToasterService),
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 2;

    fixture = TestBed.createComponent(BlockchainEthModalComponent);

    comp = fixture.componentInstance;

    comp.hasMetamask = true;

    spyOn(comp.session, 'getLoggedInUser').and.returnValue({
      eth_wallet: '0x00000000000000',
      rewards: true,
    });

    spyOn(comp.session, 'isLoggedIn').and.returnValue(true);

    fixture.detectChanges();
    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        done();
      });
    }
  });

  it('should instantiate modal', () => {
    expect(comp).toBeTruthy();
  });

  it('should redirect when buy clicked', () => {
    comp.usd = 40;
    comp.hasMetamask = true;
    siteServiceMock.baseUrl = 'https://www.minds.com/';

    comp.buy();

    expect(sendWyreMock.redirect).toHaveBeenCalledWith({
      dest: 'ethereum:0x00000000000000',
      destCurrency: 'ETH',
      amount: '40',
      sourceCurrency: 'USD',
    });
  });
});
