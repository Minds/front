import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SettingsV2SupermindComponent } from './supermind.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MockComponent, MockService } from '../../../../utils/mock';
import { SettingsV2SupermindService } from './supermind.component.service';
import { ToasterService } from '../../../../common/services/toaster.service';
import { BehaviorSubject, of } from 'rxjs';
import { SupermindSettings } from './supermind.types';

describe('SettingsV2SupermindComponent', () => {
  let comp: SettingsV2SupermindComponent;
  let fixture: ComponentFixture<SettingsV2SupermindComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [
        SettingsV2SupermindComponent,
        MockComponent({
          selector: 'm-settingsV2__header',
        }),
        MockComponent({
          selector: 'm-loadingSpinner',
          inputs: ['inProgress'],
        }),
        MockComponent({
          selector: 'm-addBankPrompt',
        }),
        MockComponent({
          selector: 'm-button',
          inputs: ['disabled', 'saving'],
          outputs: ['onAction'],
        }),
      ],
      providers: [
        {
          provide: SettingsV2SupermindService,
          useValue: MockService(SettingsV2SupermindService, {
            has: ['settings$'],
            props: {
              settings$: {
                get: () =>
                  new BehaviorSubject<SupermindSettings>({
                    min_cash: 20,
                    min_offchain_tokens: 2,
                  }),
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
  }));

  beforeEach((done) => {
    fixture = TestBed.createComponent(SettingsV2SupermindComponent);
    comp = fixture.componentInstance;

    (comp as any).supermindService.getConfig.calls.reset();
    (comp as any).supermindService.updateSettings$.calls.reset();

    (comp as any).supermindService.getConfig.and.returnValue({
      min_thresholds: {
        min_cash: 10,
        min_offchain_tokens: 1,
      },
    });

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

  it('should instantiate', () => {
    expect(comp).toBeTruthy();
    expect((comp as any).supermindService.getConfig).toHaveBeenCalled();
    expect(comp.form).toBeTruthy();
    expect(comp.form.controls['min_offchain_tokens'].value).toBe(2);
    expect(comp.form.controls['min_cash'].value).toBe(20);
  });

  it('should return if form can be submitted', () => {
    comp.form.controls['min_offchain_tokens'].setValue(100);
    comp.form.controls['min_cash'].setValue(100);
    expect(comp.canSubmit()).toBeTrue();
  });

  it('should return if form can be submitted with 2 decimal places', () => {
    comp.form.controls['min_offchain_tokens'].setValue(100.11);
    comp.form.controls['min_cash'].setValue(100.11);
    expect(comp.canSubmit()).toBeTrue();
  });

  it('should return if form cannot be submitted because min offchain token amount is below min threshold', () => {
    comp.form.controls['min_offchain_tokens'].setValue(0.9);
    comp.form.controls['min_cash'].setValue(100);
    expect(comp.canSubmit()).toBeFalse();

    const minOffchainTokenErrors = comp.getFormErrors('min_offchain_tokens');
    expect(minOffchainTokenErrors?.min).toEqual({ min: 1, actual: 0.9 });
    expect(minOffchainTokenErrors?.required).toBeUndefined();
    expect(minOffchainTokenErrors?.pattern).toBeUndefined();

    const minCashErrors = comp.getFormErrors('min_cash');
    expect(minCashErrors?.min).toBeUndefined();
    expect(minCashErrors?.required).toBeUndefined();
    expect(minCashErrors?.pattern).toBeUndefined();
  });

  it('should return if form cannot be submitted because min cash amount is below min threshold', () => {
    comp.form.controls['min_offchain_tokens'].setValue(1);
    comp.form.controls['min_cash'].setValue(9);
    expect(comp.canSubmit()).toBeFalse();

    const minOffchainTokenErrors = comp.getFormErrors('min_offchain_tokens');
    expect(minOffchainTokenErrors?.min).toBeUndefined();
    expect(minOffchainTokenErrors?.required).toBeUndefined();
    expect(minOffchainTokenErrors?.pattern).toBeUndefined();

    const minCashErrors = comp.getFormErrors('min_cash');
    expect(minCashErrors?.min).toEqual({ min: 10, actual: 9 });
    expect(minCashErrors?.required).toBeUndefined();
    expect(minCashErrors?.pattern).toBeUndefined();
  });

  it('should return if form cannot be submitted because min offchain token amount is missing', () => {
    comp.form.controls['min_offchain_tokens'].setValue(null);
    comp.form.controls['min_cash'].setValue(100);
    expect(comp.canSubmit()).toBeFalse();

    const minOffchainTokenErrors = comp.getFormErrors('min_offchain_tokens');
    expect(minOffchainTokenErrors?.min).toBeUndefined();
    expect(minOffchainTokenErrors?.required).toBeTrue();
    expect(minOffchainTokenErrors?.pattern).toBeUndefined();

    const minCashErrors = comp.getFormErrors('min_cash');
    expect(minCashErrors?.min).toBeUndefined();
    expect(minCashErrors?.required).toBeUndefined();
    expect(minCashErrors?.pattern).toBeUndefined();
  });

  it('should return if form cannot be submitted because min cash amount is missing', () => {
    comp.form.controls['min_offchain_tokens'].setValue(1);
    comp.form.controls['min_cash'].setValue(null);
    expect(comp.canSubmit()).toBeFalse();

    const minOffchainTokenErrors = comp.getFormErrors('min_offchain_tokens');
    expect(minOffchainTokenErrors?.min).toBeUndefined();
    expect(minOffchainTokenErrors?.required).toBeUndefined();
    expect(minOffchainTokenErrors?.pattern).toBeUndefined();

    const minCashErrors = comp.getFormErrors('min_cash');
    expect(minCashErrors?.min).toBeUndefined();
    expect(minCashErrors?.required).toBeTrue();
    expect(minCashErrors?.pattern).toBeUndefined();
  });

  it('should return if form cannot be submitted because min offchain token amount is more than 2 decimal places', () => {
    comp.form.controls['min_offchain_tokens'].setValue(100.111);
    comp.form.controls['min_cash'].setValue(100);
    expect(comp.canSubmit()).toBeFalse();

    const minOffchainTokenErrors = comp.getFormErrors('min_offchain_tokens');
    expect(minOffchainTokenErrors?.min).toBeUndefined();
    expect(minOffchainTokenErrors?.required).toBeUndefined();
    expect(minOffchainTokenErrors?.pattern).toBeTruthy();

    const minCashErrors = comp.getFormErrors('min_cash');
    expect(minCashErrors?.min).toBeUndefined();
    expect(minCashErrors?.required).toBeUndefined();
    expect(minCashErrors?.pattern).toBeUndefined();
  });

  it('should return if form cannot be submitted because min cash amount is more than 2 decimal places', () => {
    comp.form.controls['min_offchain_tokens'].setValue(1);
    comp.form.controls['min_cash'].setValue(10.111);
    expect(comp.canSubmit()).toBeFalse();

    const minOffchainTokenErrors = comp.getFormErrors('min_offchain_tokens');
    expect(minOffchainTokenErrors?.min).toBeUndefined();
    expect(minOffchainTokenErrors?.required).toBeUndefined();
    expect(minOffchainTokenErrors?.pattern).toBeUndefined();

    const minCashErrors = comp.getFormErrors('min_cash');
    expect(minCashErrors?.min).toBeUndefined();
    expect(minCashErrors?.required).toBeUndefined();
    expect(minCashErrors?.pattern).toBeTruthy();
  });

  it('should call service to save settings', () => {
    comp.form.controls['min_offchain_tokens'].setValue(1);
    comp.form.controls['min_cash'].setValue(10.111);
    (comp as any).supermindService.updateSettings$.and.returnValue(
      of({
        min_cash: 40,
        min_offchain_tokens: 4,
      })
    );

    comp.save();

    expect(comp.savingInProgress$.getValue()).toBeFalse();
    expect((comp as any).toaster.success).toHaveBeenCalledOnceWith(
      'Settings saved'
    );
  });
});
