import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MockComponent, MockService } from '../../../../../utils/mock';
import { CashWalletService } from '../cash.service';
import { WalletSettingsCashComponent } from './settings-cash.component';

describe('WalletSettingsCashComponent', () => {
  let comp: WalletSettingsCashComponent;
  let fixture: ComponentFixture<WalletSettingsCashComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          WalletSettingsCashComponent,
          MockComponent({
            selector: 'm-button',
          }),
          MockComponent({
            selector: 'm-icon',
            inputs: ['sizeFactor'],
          }),
        ],
        providers: [
          {
            provide: CashWalletService,
            useValue: MockService(CashWalletService),
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(WalletSettingsCashComponent);
    comp = fixture.componentInstance;

    fixture.detectChanges();

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        done();
      });
    }
  });

  it('should initialize', () => {
    expect(comp).toBeTruthy();
  });

  it('should redirect to onboarding', () => {
    (comp as any).redirectToOnboarding();
    expect(
      (comp as any).cashService.redirectToOnboarding
    ).toHaveBeenCalledTimes(1);
  });
});
