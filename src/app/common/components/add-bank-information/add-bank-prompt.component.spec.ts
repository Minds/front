import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { BehaviorSubject, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { ExperimentsService } from '../../../modules/experiments/experiments.service';
import { CashWalletService } from '../../../modules/wallet/components/cash/cash.service';
import {
  Wallet,
  WalletV2Service,
} from '../../../modules/wallet/components/wallet-v2.service';
import { MockComponent, MockService } from '../../../utils/mock';
import { ApiService } from '../../api/api.service';
import { ToasterService } from '../../services/toaster.service';
import { AddBankPromptComponent } from './add-bank-prompt.component';

describe('AddBankPromptComponent', () => {
  let comp: AddBankPromptComponent;
  let fixture: ComponentFixture<AddBankPromptComponent>;

  let apiServiceMock = new (function() {
    this.success = jasmine.createSpy('success').and.returnValue(this);
    this.get = jasmine
      .createSpy('success')
      .and.returnValue(new Observable(null));
  })();

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          AddBankPromptComponent,
          MockComponent({
            selector: 'm-loadingSpinner',
            inputs: ['inProgress'],
          }),
        ],
        providers: [
          CashWalletService,
          ToasterService,
          {
            provide: ApiService,
            useValue: apiServiceMock,
          },
          {
            provide: ExperimentsService,
            useValue: MockService(ExperimentsService),
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(AddBankPromptComponent);
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

  // it('should determine if prompt should NOT show', (done: DoneFn) => {
  //   mockApiGet$.next({
  //     id: 'acct_fake',
  //   });

  // });

  // it('should determine if prompt should show because loading is not done', (done: DoneFn) => {

  // });

  // it('should determine if prompt should show because hasAccount is false', (done: DoneFn) => {

  // });

  // it('should determine if prompt should show because hasBank is false', (done: DoneFn) => {

  // });
});
