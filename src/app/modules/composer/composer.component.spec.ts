import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ComposerComponent } from './composer.component';
import { ComposerService } from './services/composer.service';
import { MockComponent, MockService } from '../../utils/mock';
import { ComposerModalService } from './components/modal/modal.service';
import { By } from '@angular/platform-browser';
import { ToasterService } from '../../common/services/toaster.service';
import { composerMockService } from '../../mocks/modules/composer/services/composer.service.mock';
import { Session } from '../../services/session';
import { sessionMock } from '../../../tests/session-mock.spec';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { CookieService } from '../../common/services/cookie.service';
import {
  CookieOptionsProvider,
  COOKIE_OPTIONS,
  CookieModule,
} from '@mindsorg/ngx-universal';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LivestreamService } from '../../modules/composer/services/livestream.service';

describe('Composer', () => {
  let comp: ComposerComponent;
  let fixture: ComponentFixture<ComposerComponent>;
  let cookieService: CookieService;
  let service: LivestreamService;

  beforeEach(
    waitForAsync(() => {
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
        imports: [CookieModule, HttpClientTestingModule],
        providers: [
          {
            provide: ComposerModalService,
            useValue: MockService(ComposerModalService),
          },
          {
            provide: ToasterService,
            useValue: MockService(ToasterService),
          },
          {
            provide: Session,
            useValue: sessionMock,
          },
          {
            provide: ActivatedRoute,
            useValue: {
              queryParamMap: new BehaviorSubject(convertToParamMap({})),
            },
          },
          {
            provide: Router,
            useValue: MockService(Router),
          },
          CookieService,
          {
            provide: COOKIE_OPTIONS,
            useValue: CookieOptionsProvider,
          },
          LivestreamService,
        ],
      }).compileComponents();
      service = TestBed.inject(LivestreamService);
    })
  );

  beforeEach(done => {
    cookieService = TestBed.inject(CookieService);
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
  it('should be created', () => {
    expect(service).toBeTruthy();
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
