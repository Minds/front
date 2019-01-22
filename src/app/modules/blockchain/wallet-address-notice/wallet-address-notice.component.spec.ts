import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { BlockchainWalletAddressNoticeComponent } from './wallet-address-notice.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent, MockService } from '../../../utils/mock';
import { BlockchainService } from '../blockchain.service';
import { Web3WalletService } from '../web3-wallet.service';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';

let walletService = MockService(Web3WalletService, {
  'ready': true,
  'getCurrentWallet': '0x1234',
});
let blockchainService: any = MockService(BlockchainService, {
  'getWallet': null
});

let routerMock = { navigate: jasmine.createSpy('navigate') };

describe('BlockchainWalletAddressNoticeComponent', () => {

  let comp: BlockchainWalletAddressNoticeComponent;
  let fixture: ComponentFixture<BlockchainWalletAddressNoticeComponent>;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [
        MockComponent({ selector: 'm-announcement', template: '<ng-content></ng-content>' }),
        BlockchainWalletAddressNoticeComponent
      ],
      imports: [RouterTestingModule, ReactiveFormsModule],
      providers: [
        { provide: Web3WalletService, useValue: walletService },
        { provide: BlockchainService, useValue: blockchainService },
        { provide: Router, useValue: routerMock }
      ]
    })
      .compileComponents();
  }));

  beforeEach((done) => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 2;

    fixture = TestBed.createComponent(BlockchainWalletAddressNoticeComponent);

    comp = fixture.componentInstance;

    fixture.detectChanges();

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable()
        .then(() => {
          fixture.detectChanges();
          done()
        });
    }
  });

  it('should have an m-announcement with a prompt to set up the wallet', fakeAsync(() => {
    fixture.detectChanges();
    const announcement = fixture.debugElement.query(By.css('m-announcement'));
    expect(announcement).not.toBeNull();

    const text = fixture.debugElement.query(By.css('m-announcement span'));
    expect(text).not.toBeNull();
    expect(text.nativeElement.textContent).toContain('Hey, do you want to setup your Tokens wallet?');
  }));

  it('clicking on the text should set up the wallet and navigate to /wallet/tokens/addresses', fakeAsync(() => {
    spyOn(comp, 'setWallet').and.callThrough();
    const text = fixture.debugElement.query(By.css('m-announcement span'));
    text.nativeElement.click();

    expect(comp.setWallet).toHaveBeenCalled();
    jasmine.clock().tick(10);

    expect(blockchainService.setWallet).toHaveBeenCalled();
    expect(blockchainService.setWallet).toHaveBeenCalled();

    expect(blockchainService.setWallet.calls.mostRecent().args[0]).toEqual({ address: '0x1234' });
    expect(routerMock.navigate).toHaveBeenCalled();
    expect(routerMock.navigate.calls.mostRecent().args[0]).toEqual(['/wallet/tokens/addresses']);
  }));

});
