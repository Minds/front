import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ComposerComponent } from './composer.component';
import { ComposerService } from './services/composer.service';
import { MockComponent, MockService } from '../../utils/mock';
import { ModalService } from './components/modal/modal.service';
import { By } from '@angular/platform-browser';
import { FormToastService } from '../../common/services/form-toast.service';
import { composerMockService } from '../../mocks/modules/composer/services/composer.service.mock';
import { Session } from '../../services/session';
import { sessionMock } from '../../../tests/session-mock.spec';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { CookieService } from '@gorniv/ngx-universal';

describe('Composer', () => {
  let comp: ComposerComponent;
  let fixture: ComponentFixture<ComposerComponent>;

  beforeEach(async(() => {
    TestBed.overrideProvider(ComposerService, {
      useValue: composerMockService,
    });

    TestBed.configureTestingModule({
      declarations: [
        ComposerComponent,
        MockComponent({
          selector: 'm-composer__base',
          outputs: ['onPost'],
        }),
      ],
      providers: [
        { provide: ModalService, useValue: MockService(ModalService) },
        { provide: FormToastService, useValue: MockService(FormToastService) },
        { provide: Session, useValue: sessionMock },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParamMap: new BehaviorSubject(convertToParamMap({})),
          },
        },
        { provide: Router, useValue: MockService(Router) },
        { provide: CookieService, useValue: MockService(CookieService) },
      ],
    }).compileComponents();
  }));

  beforeEach(done => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 2;
    fixture = TestBed.createComponent(ComposerComponent);
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

  it('should render an embedded base composer', () => {
    comp.embedded = true;
    comp.detectChanges();
    fixture.detectChanges();

    const baseComposer = fixture.debugElement.query(
      By.css('m-composer__base:not(.m-composer__triggerPreview)')
    );
    expect(baseComposer).not.toBeNull();
  });

  it('should render a clickable base composer', () => {
    comp.embedded = false;
    comp.detectChanges();
    fixture.detectChanges();

    const baseComposer = fixture.debugElement.query(
      By.css('m-composer__base.m-composer__triggerPreview')
    );
    expect(baseComposer).not.toBeNull();
  });
});
