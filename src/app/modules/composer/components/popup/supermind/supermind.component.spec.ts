import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '../../../../../common/api/api.service';
import { CommonModule } from '../../../../../common/common.module';
import { AutocompleteUserInputComponent } from '../../../../../common/components/forms/autocomplete-user-input/autocomplete-user-input.component';
import { ConfigsService } from '../../../../../common/services/configs.service';
import { MockService } from '../../../../../utils/mock';
import {
  ComposerService,
  ComposerSize,
} from '../../../services/composer.service';
import { PopupService } from '../popup.service';
import { ComposerSupermindComponent } from '../supermind/supermind.component';

describe('Composer Supermind Popup', () => {
  let comp: ComposerSupermindComponent;
  let fixture: ComponentFixture<ComposerSupermindComponent>;

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
        declarations: [ComposerSupermindComponent],
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
          {
            provide: ConfigsService,
            useValue: MockService(ConfigsService),
          },
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

  it('should show clear form', () => {
    const clearBtn = fixture.debugElement.nativeElement.querySelector(
      '[data-ref="supermind-clear-button"]'
    );
    expect(clearBtn).toBeDefined();
  });
});
