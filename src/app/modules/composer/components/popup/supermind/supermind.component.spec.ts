import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  AbstractControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ApiService } from '../../../../../common/api/api.service';
import { CommonModule } from '../../../../../common/common.module';
import { ButtonComponent } from '../../../../../common/components/button/button.component';
import { ConfigsService } from '../../../../../common/services/configs.service';
import { MockComponent, MockService } from '../../../../../utils/mock';
import { ComposerService } from '../../../services/composer.service';
import { PopupService } from '../popup.service';
import { ComposerSupermindComponent } from '../supermind/supermind.component';
import { EntityResolverService } from '../../../../../common/services/entity-resolver.service';
import { of } from 'rxjs';
import { SupermindNonStripeOffersExperimentService } from '../../../../experiments/sub-services/supermind-non-stripe-offers-experiment.service';
import { TwitterSupermindExperimentService } from '../../../../experiments/sub-services/twitter-supermind-experiment.service';
import { ToasterService } from '../../../../../common/services/toaster.service';
import { ModalService } from '../../../../../services/ux/modal.service';
import { Injector } from '@angular/core';
import { SUPERMIND_RESPONSE_TYPES } from './superminds-creation.service';
import { ExplainerScreensService } from '../../../../explainer-screens/services/explainer-screen.service';

describe('Composer Supermind Popup', () => {
  let comp: ComposerSupermindComponent;
  let fixture: ComponentFixture<ComposerSupermindComponent>;

  let getClearBtn = (): ButtonComponent =>
    fixture.debugElement.query(By.css('[data-ref="supermind-clear-button"]'))
      ?.componentInstance;
  let getSaveBtn = (): ButtonComponent =>
    fixture.debugElement.query(By.css('[data-ref="supermind-save-button"]'))
      ?.componentInstance;

  let superMindsRequestMock$ = jasmine.createSpyObj('superMindsRequestMock$', {
    next: () => {},
    getValue: () => false,
    subscribe: { unsubscribe: () => {} },
  });

  const composerServiceMock: any = MockService(ComposerService, {
    has: ['supermindRequest$'],
    props: {
      supermindRequest$: { get: () => superMindsRequestMock$ },
    },
  });

  const popupServiceMock: any = MockService(PopupService, {
    create: function() {
      return this;
    },
    present: { toPromise: () => {} },
  });

  const apiMock = new (function() {
    this.get = jasmine.createSpy('get');
  })();

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [ReactiveFormsModule, FormsModule, CommonModule],
        declarations: [
          ComposerSupermindComponent,
          MockComponent({
            selector: 'm-payments__selectCard',
            inputs: ['selected'],
          }),
        ],
        providers: [
          {
            provide: ComposerService,
            useValue: composerServiceMock,
          },
          {
            provide: PopupService,
            useValue: popupServiceMock,
          },
          {
            provide: ApiService,
            useValue: apiMock,
          },
          {
            provide: ExplainerScreensService,
            useValue: MockService(ExplainerScreensService),
          },
          {
            provide: ConfigsService,
            useValue: MockService(ConfigsService),
          },
          {
            provide: EntityResolverService,
            useValue: MockService(EntityResolverService),
          },
          {
            provide: SupermindNonStripeOffersExperimentService,
            useValue: MockService(SupermindNonStripeOffersExperimentService),
          },
          {
            provide: TwitterSupermindExperimentService,
            useValue: MockService(TwitterSupermindExperimentService),
          },
          {
            provide: ToasterService,
            useValue: MockService(ToasterService),
          },
          {
            provide: ModalService,
            useValue: MockService(ModalService),
          },
          {
            provide: Injector,
            useValue: MockService(Injector),
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(ComposerSupermindComponent);
    comp = fixture.componentInstance;

    (comp as any).mindsConfig.get.and.returnValue({
      min_thresholds: {
        min_cash: 10,
        min_offchain_tokens: 1,
      },
    });

    (comp as any).entityResolverService.get$.and.returnValue(
      of({
        supermind_settings: {
          min_cash: 10,
          min_offchain_tokens: 1,
        },
        merchant: {},
      })
    );

    apiMock.get.calls.reset();
    apiMock.get.and.returnValue([]);

    fixture.detectChanges();

    (comp as any).twitterSupermindExperimentService.isActive.and.returnValue(
      false
    );

    const twitterRequiredFormControl: AbstractControl =
      comp.formGroup.controls.twitterRequired;
    const responseTypeControl: AbstractControl =
      comp.formGroup.controls.responseType;

    twitterRequiredFormControl.setValue(false);
    twitterRequiredFormControl.enable();
    responseTypeControl.setValue(SUPERMIND_RESPONSE_TYPES.TEXT);

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

  it('should NOT show clear form button', () => {
    expect(getClearBtn()).toBeUndefined();
  });

  it('should show clear form button when dirty', () => {
    comp.formGroup.controls.username.setValue('minds');
    fixture.detectChanges();

    expect(getClearBtn).toBeDefined();
  });

  it('should show save button', () => {
    expect(getSaveBtn()).toBeDefined();
  });

  it('should have initial disabled save state', () => {
    expect(getSaveBtn().disabled).toBeTrue();
  });

  it('should have enabled save button when conditions form is valid', () => {
    comp.formGroup.controls.termsAccepted.setValue(true);
    comp.formGroup.controls.refundPolicyAccepted.setValue(true);
    comp.formGroup.controls.username.setValue('minds');
    fixture.detectChanges();
    expect(getSaveBtn().disabled).toBeFalse();
  });

  describe('onSave', () => {
    it('should update composer supermindRequest$ service on save', () => {
      comp.formGroup.controls.termsAccepted.setValue(true);
      comp.formGroup.controls.refundPolicyAccepted.setValue(true);
      comp.formGroup.controls.username.setValue('minds');
      fixture.detectChanges();

      getSaveBtn().onAction.next(new MouseEvent('click'));

      expect(getSaveBtn().disabled).toBeFalse();

      expect(superMindsRequestMock$.next).toHaveBeenCalled();
    });

    it('should show modal to explain live reply type on save when live reply type is selected', () => {
      const responseTypeControl: AbstractControl =
        comp.formGroup.controls.responseType;
      responseTypeControl.setValue(SUPERMIND_RESPONSE_TYPES.LIVE);

      comp.onSave();

      expect((comp as any).modalService.present).toHaveBeenCalled();
    });
  });

  describe('responseTypeSubscription', () => {
    it('should disable and wipe twitter reply required value on selecting a live reply type', () => {
      (comp as any).twitterSupermindExperimentService.isActive.and.returnValue(
        true
      );
      comp.ngOnInit();

      const twitterRequiredFormControl: AbstractControl =
        comp.formGroup.controls.twitterRequired;
      const responseTypeControl: AbstractControl =
        comp.formGroup.controls.responseType;
      twitterRequiredFormControl.enable();
      twitterRequiredFormControl.setValue(true);

      responseTypeControl.setValue(SUPERMIND_RESPONSE_TYPES.LIVE);
      fixture.detectChanges();

      expect(twitterRequiredFormControl.disabled).toBeTrue();
      expect(twitterRequiredFormControl.value).toBeFalse();
    });

    it('should enable twitter reply required control on selecting a NON live reply type', () => {
      (comp as any).twitterSupermindExperimentService.isActive.and.returnValue(
        true
      );
      comp.ngOnInit();

      const twitterRequiredFormControl: AbstractControl =
        comp.formGroup.controls.twitterRequired;
      const responseTypeControl: AbstractControl =
        comp.formGroup.controls.responseType;
      twitterRequiredFormControl.disable();

      responseTypeControl.setValue(SUPERMIND_RESPONSE_TYPES.TEXT);
      fixture.detectChanges();

      expect(twitterRequiredFormControl.disabled).toBeFalse();
    });
  });

  it('should call to handle a manual explainer screen trigger', () => {
    (comp as any).explainerScreenService.handleManualTriggerByKey.calls.reset();
    comp.ngOnInit();
    expect(
      (comp as any).explainerScreenService.handleManualTriggerByKey
    ).toHaveBeenCalledOnceWith('supermind_request');
  });
});
