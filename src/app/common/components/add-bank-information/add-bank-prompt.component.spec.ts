import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { CashWalletService } from '../../../modules/wallet/components/cash/cash.service';
import { MockComponent, MockService } from '../../../utils/mock';
import { ToasterService } from '../../services/toaster.service';
import { ButtonComponent } from '../button/button.component';
import { AddBankPromptComponent } from './add-bank-prompt.component';

describe('AddBankPromptComponent', () => {
  let comp: AddBankPromptComponent;
  let fixture: ComponentFixture<AddBankPromptComponent>;

  function getNoAccountDiv() {
    return fixture.debugElement.query(
      By.css('.m-addBankPrompt__container--noAccount')
    );
  }

  function getAccountRestrictedDiv() {
    return fixture.debugElement.query(
      By.css('.m-addBankPrompt__container--restricted')
    );
  }

  function getAccountRestrictedTitle() {
    return fixture.debugElement.query(
      By.css('.m-addBankPrompt__container--restricted p b')
    );
  }

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          AddBankPromptComponent,
          MockComponent({
            selector: 'm-loadingSpinner',
            inputs: ['inProgress'],
          }),
          MockComponent({
            selector: 'm-icon',
            inputs: ['sizeFactor'],
          }),
          MockComponent({
            selector: 'm-button',
          }),
        ],
        providers: [
          {
            provide: CashWalletService,
            useValue: MockService(CashWalletService, {
              has: [
                'isLoading$$',
                'hasAccount$',
                'isRestricted$',
                'restrictedReason$',
              ],
              props: {
                isLoading$$: { get: () => new BehaviorSubject<boolean>(false) },
                hasAccount$: { get: () => new BehaviorSubject<boolean>(false) },
                isRestricted$: {
                  get: () => new BehaviorSubject<boolean>(false),
                },
                restrictedReason$: {
                  get: () => new BehaviorSubject<string>(''),
                },
              },
            }),
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
    fixture = TestBed.createComponent(AddBankPromptComponent);
    comp = fixture.componentInstance;

    (comp as any).cashService.isLoading$$.next(false);
    (comp as any).cashService.hasAccount$.next(false);
    (comp as any).cashService.isRestricted$.next(false);
    (comp as any).cashService.restrictedReason$.next('');

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

  it('should create an account', async () => {
    await comp.createAccount(null, new ButtonComponent());

    expect((comp as any).cashService.createAccount).toHaveBeenCalled();
    expect((comp as any).cashService.redirectToOnboarding).toHaveBeenCalled();
  });

  it('should show toaster on error and set saving to false when creating an account', async () => {
    const errorMessage = 'Error!';
    (comp as any).cashService.createAccount.and.throwError({
      error: { message: errorMessage },
    });

    await comp.createAccount(null, new ButtonComponent());

    expect((comp as any).cashService.createAccount).toHaveBeenCalled();
    expect((comp as any).toasterService.error).toHaveBeenCalledWith(
      errorMessage
    );
    expect(
      (comp as any).cashService.redirectToOnboarding
    ).not.toHaveBeenCalled();
  });

  it('should redirect to cash onboarding', () => {
    comp.redirectToOnboarding(null);
    expect((comp as any).cashService.redirectToOnboarding).toHaveBeenCalled();
  });

  it('should show no account div if the user has no account', () => {
    (comp as any).cashService.hasAccount$.next(false);

    fixture.detectChanges();
    expect(getNoAccountDiv()).toBeTruthy();
    expect(getAccountRestrictedDiv()).toBeNull();
  });

  it('should show restricted div if the user has a restricted account with reason: platform_paused', () => {
    (comp as any).cashService.hasAccount$.next(true);
    (comp as any).cashService.isRestricted$.next(true);
    (comp as any).cashService.restrictedReason$.next('platform_paused');

    fixture.detectChanges();
    expect(getAccountRestrictedDiv()).toBeTruthy();
    expect(getAccountRestrictedTitle()?.nativeElement.textContent).toContain(
      'Cash Account Restricted'
    );
    expect(getNoAccountDiv()).toBeNull();
  });

  it('should show restricted div if the user has a restricted account with reason: requirements.past_due', () => {
    (comp as any).cashService.hasAccount$.next(true);
    (comp as any).cashService.isRestricted$.next(true);
    (comp as any).cashService.restrictedReason$.next('requirements.past_due');

    fixture.detectChanges();
    expect(getAccountRestrictedDiv()).toBeTruthy();
    expect(getAccountRestrictedTitle()?.nativeElement.textContent).toContain(
      'Your cash account is currently restricted'
    );
    expect(getNoAccountDiv()).toBeNull();
  });

  it('should show restricted div if the user has a restricted account with reason: requirements.pending_verification', () => {
    (comp as any).cashService.hasAccount$.next(true);
    (comp as any).cashService.isRestricted$.next(true);
    (comp as any).cashService.restrictedReason$.next(
      'requirements.pending_verification'
    );

    fixture.detectChanges();
    expect(getAccountRestrictedDiv()).toBeTruthy();
    expect(getAccountRestrictedTitle()?.nativeElement.textContent).toContain(
      'Verifying cash account'
    );
    expect(getNoAccountDiv()).toBeNull();
  });

  it('should show restricted div if the user has a restricted account with reason: under_review', () => {
    (comp as any).cashService.hasAccount$.next(true);
    (comp as any).cashService.isRestricted$.next(true);
    (comp as any).cashService.restrictedReason$.next('under_review');

    fixture.detectChanges();
    expect(getAccountRestrictedDiv()).toBeTruthy();
    expect(getAccountRestrictedTitle()?.nativeElement.textContent).toContain(
      'Under review'
    );
    expect(getNoAccountDiv()).toBeNull();
  });

  it('should show restricted div if the user has a restricted account with reason: default', () => {
    (comp as any).cashService.hasAccount$.next(true);
    (comp as any).cashService.isRestricted$.next(true);
    (comp as any).cashService.restrictedReason$.next(null);

    fixture.detectChanges();
    expect(getAccountRestrictedDiv()).toBeTruthy();
    expect(getAccountRestrictedTitle()?.nativeElement.textContent).toContain(
      'Your cash account is currently restricted'
    );
    expect(getNoAccountDiv()).toBeNull();
  });
});
