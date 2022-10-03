import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import {
  SUPERMIND_DEFAULT_PAYMENT_METHOD,
  SUPERMIND_DEFAULT_RESPONSE_TYPE,
} from './superminds-creation.service';

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

  let apiMock = new (function() {
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
          //   {
          //     provide: Client,
          //     useValue: MockService(Client)
          //   },
          {
            provide: ConfigsService,
            useValue: MockService(ConfigsService),
          },
          //   {
          //     provide: Session,
          //     useValue: MockService(Session),
          //   },
          {
            provide: EntityResolverService,
            useValue: MockService(EntityResolverService),
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
        merchant: true,
      })
    );

    apiMock.get.calls.reset();
    apiMock.get.and.returnValue(of([]));

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
    // comp.formGroup.controls.username.updateOn = 'change';
    comp.formGroup.controls.username.setValue('minds');
    comp.formGroup.controls.offerUsd.setValue('1234567');
    comp.formGroup.controls.offerTokens.setValue('1234567');
    comp.formGroup.controls.termsAccepted.setValue(true);
    comp.formGroup.controls.responseType.setValue(
      SUPERMIND_DEFAULT_RESPONSE_TYPE
    );
    comp.formGroup.controls.paymentMethod.setValue(
      SUPERMIND_DEFAULT_PAYMENT_METHOD
    );
    comp.formGroup.controls.cardId.setValue('123123123');
    comp.formGroup.updateValueAndValidity();
    fixture.detectChanges();

    console.log('comp.inProgress', comp.inProgress);
    console.log('comp.formGroup.valid', comp.formGroup.valid);

    // tick();
    expect(getSaveBtn().disabled).toBeFalse();
  });

  it('should update composer supermindRequest$ service on save', fakeAsync(() => {
    comp.formGroup.controls.username.setValue('minds');
    comp.formGroup.controls.offerUsd.setValue('1234567');
    comp.formGroup.controls.offerUsd.setValue('offerTokens');
    comp.formGroup.controls.termsAccepted.setValue(true);
    comp.formGroup.controls.responseType.setValue(
      SUPERMIND_DEFAULT_RESPONSE_TYPE
    );
    comp.formGroup.controls.paymentMethod.setValue(
      SUPERMIND_DEFAULT_PAYMENT_METHOD
    );
    comp.formGroup.controls.cardId.setValue('123123123');

    fixture.detectChanges();

    getSaveBtn().onAction.next(new MouseEvent('click'));
    tick();

    console.log('comp.inProgress', comp.inProgress);
    console.log('comp.formGroup.valid', comp.formGroup.valid);

    expect(getSaveBtn().disabled).toBeFalse();

    expect(superMindsRequestMock$.next).toHaveBeenCalled();
  }));
});
