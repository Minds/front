import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '../../../../../common/api/api.service';
import { CommonModule } from '../../../../../common/common.module';
import { ButtonComponent } from '../../../../../common/components/button/button.component';
import { AutocompleteUserInputComponent } from '../../../../../common/components/forms/autocomplete-user-input/autocomplete-user-input.component';
import { ConfigsService } from '../../../../../common/services/configs.service';
import { Client } from '../../../../../services/api';
import { Session } from '../../../../../services/session';
import { MockComponent, MockService } from '../../../../../utils/mock';
import { PaymentsModule } from '../../../../payments/payments.module';
import {
  ComposerService,
  ComposerSize,
} from '../../../services/composer.service';
import { PopupService } from '../popup.service';
import { ComposerSupermindComponent } from '../supermind/supermind.component';

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
            useValue: MockService(ApiService),
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
          //   }
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(ComposerSupermindComponent);
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
    comp.formGroup.controls.username.setValue('minds');
    fixture.detectChanges();

    expect(getSaveBtn().disabled).toBeFalse();
  });

  it('should update composer supermindRequest$ service on save', () => {
    comp.formGroup.controls.termsAccepted.setValue(true);
    comp.formGroup.controls.username.setValue('minds');
    fixture.detectChanges();

    getSaveBtn().onAction.next(new MouseEvent('click'));

    expect(getSaveBtn().disabled).toBeFalse();

    expect(superMindsRequestMock$.next).toHaveBeenCalled();
  });
});
