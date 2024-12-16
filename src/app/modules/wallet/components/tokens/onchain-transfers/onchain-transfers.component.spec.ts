import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockService } from '../../../../../utils/mock';
import { WalletOnchainTransfersSummaryComponent } from './onchain-transfers.component';
import { WalletOnchainTransfersSummaryService } from './onchain-transfers.service';

describe('WalletOnchainTransfersSummaryComponent', () => {
  let comp: WalletOnchainTransfersSummaryComponent;
  let fixture: ComponentFixture<WalletOnchainTransfersSummaryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [WalletOnchainTransfersSummaryComponent],
      providers: [
        {
          provide: WalletOnchainTransfersSummaryService,
          useValue: MockService(WalletOnchainTransfersSummaryService),
        },
      ],
    }).compileComponents();
  }));

  beforeEach((done) => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 2;
    fixture = TestBed.createComponent(WalletOnchainTransfersSummaryComponent);
    comp = fixture.componentInstance;
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

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  it('should call to load', () => {
    expect((comp as any).service.getWithdrawals$).toHaveBeenCalledWith('');
  });

  it('should call to load more with pagination token set', () => {
    comp.pagingToken = '123';
    comp.load();
    expect((comp as any).service.getWithdrawals$).toHaveBeenCalledWith('123');
  });

  it('should open etherscan explorer', () => {
    spyOn(window, 'open');
    comp.openExplorer('123');
    expect(window.open).toHaveBeenCalledWith(
      `https://etherscan.com/tx/123`,
      '_blank'
    );
  });

  it('should truncate address', () => {
    expect(comp.truncateAddress('0x00222222221111')).toBe('0x00...1111');
  });
});
