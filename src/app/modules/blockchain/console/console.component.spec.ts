import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockchainConsoleComponent } from './console.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent, MockDirective, MockService } from '../../../utils/mock';
import { BlockchainService } from '../blockchain.service';
import { Web3WalletService } from '../web3-wallet.service';
import { By } from '@angular/platform-browser';

describe('BlockchainConsoleComponent', () => {

  let comp: BlockchainConsoleComponent;
  let fixture: ComponentFixture<BlockchainConsoleComponent>;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [MockDirective({ selector: '[mdl]', inputs: ['mdl'] }),
        MockComponent({ selector: 'm-blockchain--wallet-selector', inputs: ['current'], outputs: ['select'] }),
        BlockchainConsoleComponent],
      imports: [RouterTestingModule, ReactiveFormsModule],
      providers: [
        { provide: BlockchainService, useValue: MockService(BlockchainService) },
        { provide: Web3WalletService, useValue: MockService(Web3WalletService) },
      ]
    })
      .compileComponents();
  }));

  beforeEach((done) => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 2;

    fixture = TestBed.createComponent(BlockchainConsoleComponent);

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

  it('should have a title', () => {
    const h3 = fixture.debugElement.query(By.css('.m-blockchain--options-wallet h3'));
    expect(h3).not.toBeNull();
    expect(h3.nativeElement.textContent).toContain('Token Configuration');
  });

  it('should have an explanation', () => {
    const text = fixture.debugElement.query(By.css('.m-blockchain--options-wallet--setup p'));
    expect(text).not.toBeNull();
    expect(text.nativeElement.textContent).toContain('Enter your Ethereum wallet address below. If you installed and unlocked MetaMask, or have a web3-enabled browser your local wallets will be listed below. You can click on them to auto-fill the address field.');
  });

  it('should have a form with a wallet address input, a list of local wallets and a save button', () => {
    expect(fixture.debugElement.query(By.css('form'))).not.toBeNull();

    const inputLabel = fixture.debugElement.query(By.css('form .m-blockchain--options--section:first-child label'));
    expect(inputLabel).not.toBeNull();
    expect(inputLabel.nativeElement.textContent).toContain('Ethereum Wallet Address');

    const input = fixture.debugElement.query(By.css('form .m-blockchain--options--section:first-child input'));
    expect(input).not.toBeNull();

    const walletsLabel = fixture.debugElement.query(By.css('form .m-blockchain--options--section:nth-child(2) label'));
    expect(walletsLabel).not.toBeNull();
    expect(walletsLabel.nativeElement.textContent).toContain('Local Wallets');

    //refresh button
    const refreshButton = fixture.debugElement.query(By.css('.m-blockchain--options--local-wallets--refresh'));
    expect(refreshButton).not.toBeNull();
    expect(refreshButton.nativeElement.textContent).toContain('autorenew');

    expect(fixture.debugElement.query(By.css('m-blockchain--wallet-selector'))).not.toBeNull();

    const saveButton = fixture.debugElement.query(By.css('.m-blockchain--options--section button'));
    expect(saveButton).not.toBeNull();
    expect(saveButton.nativeElement.textContent).toContain('Save Address');
  });

  it('should submit a new wallet', () => {
    const input = fixture.debugElement.query(By.css('form .m-blockchain--options--section:first-child input'));
    input.nativeElement.value = '0xE8f01b5254B5fACaF2d5Bbf7CFd782dF283B945D';
    input.nativeElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    spyOn(comp,'setWallet').and.callThrough();

    const saveButton = fixture.debugElement.query(By.css('.m-blockchain--options--section button'));
    saveButton.nativeElement.click();

    fixture.detectChanges();

    expect(comp.setWallet).toHaveBeenCalled();
  });

});
