import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MockComponent, MockService } from '../../../../utils/mock';
import { BehaviorSubject, Observable } from 'rxjs';
import { BoostModalV2FooterComponent } from './footer.component';
import { BoostModalV2Service } from '../services/boost-modal-v2.service';
import { BoostModalPanel, BoostSubject } from '../boost-modal-v2.types';
import { By } from '@angular/platform-browser';
import { IS_TENANT_NETWORK } from '../../../../common/injection-tokens/tenant-injection-tokens';

describe('BoostModalV2FooterComponent', () => {
  let comp: BoostModalV2FooterComponent;
  let fixture: ComponentFixture<BoostModalV2FooterComponent>;

  const getDescriptionTextContent = () =>
    fixture.debugElement.query(
      By.css('.m-boostModalFooter__descriptionTextInnerContainer span')
    )?.nativeElement?.textContent ?? null;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [
        BoostModalV2FooterComponent,
        MockComponent({
          selector: 'm-button',
          inputs: ['solid', 'saving', 'disabled'],
        }),
      ],
      providers: [
        {
          provide: BoostModalV2Service,
          useValue: MockService(BoostModalV2Service, {
            has: [
              'activePanel$',
              'entityType$',
              'boostSubmissionInProgress$',
              'disableSubmitButton$',
            ],
            props: {
              activePanel$: {
                get: () =>
                  new BehaviorSubject<BoostModalPanel>(
                    BoostModalPanel.AUDIENCE
                  ),
              },
              entityType$: {
                get: () => new BehaviorSubject<BoostSubject>(BoostSubject.POST),
              },
              boostSubmissionInProgress$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
              disableSubmitButton$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
            },
          }),
        },
        {
          provide: IS_TENANT_NETWORK,
          useValue: false,
        },
      ],
    }).compileComponents();
  }));

  beforeEach((done) => {
    fixture = TestBed.createComponent(BoostModalV2FooterComponent);
    comp = fixture.componentInstance;

    comp.activePanel$.next(BoostModalPanel.AUDIENCE);
    (comp as any).entityType$.next(BoostSubject.POST);

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
  });

  it('should call to change panel on button click', fakeAsync(() => {
    comp.activePanel$.next(BoostModalPanel.AUDIENCE);
    comp.onButtonClick(null);
    tick();

    expect((comp as any).service.changePanelFrom).toHaveBeenCalledWith(
      BoostModalPanel.AUDIENCE
    );
  }));

  // audience  panel

  it('should show no text for audience panel', () => {
    (comp as any).entityType$.next(BoostSubject.POST);
    comp.activePanel$.next(BoostModalPanel.AUDIENCE);
    fixture.detectChanges();

    expect(getDescriptionTextContent()).toBeNull();
  });

  // budget panel

  it('should show text for budget panel when subject is a post', () => {
    (comp as any).entityType$.next(BoostSubject.POST);
    comp.activePanel$.next(BoostModalPanel.BUDGET);
    fixture.detectChanges();

    expect(getDescriptionTextContent()).toContain(
      'Estimated reach is approximate and can fluctuate based on network demand.'
    );
  });

  it('should show text for budget panel when subject is a channel', () => {
    (comp as any).entityType$.next(BoostSubject.CHANNEL);
    comp.activePanel$.next(BoostModalPanel.BUDGET);
    fixture.detectChanges();

    expect(getDescriptionTextContent()).toContain(
      'Estimated reach is approximate and can fluctuate based on network demand.'
    );
  });

  // review panel

  it('should show text for review panel when subject is a post', () => {
    (comp as any).entityType$.next(BoostSubject.POST);
    comp.activePanel$.next(BoostModalPanel.REVIEW);
    fixture.detectChanges();

    expect(getDescriptionTextContent()).toContain('By clicking Boost');
  });

  it('should show text for review panel when subject is a channel', () => {
    (comp as any).entityType$.next(BoostSubject.CHANNEL);
    comp.activePanel$.next(BoostModalPanel.REVIEW);
    fixture.detectChanges();

    expect(getDescriptionTextContent()).toContain('By clicking Boost');
  });

  describe('getContentPolicyUrlPath', () => {
    it('should return content policy URL path for tenant network', () => {
      (comp as any).isTenantNetwork = true;
      expect((comp as any).getContentPolicyUrlPath()).toBe(
        '/pages/community-guidelines'
      );
    });

    it('should return content policy URL path for non-tenant network', () => {
      (comp as any).isTenantNetwork = false;
      expect((comp as any).getContentPolicyUrlPath()).toBe('/content-policy');
    });
  });

  describe('getTermsUrlPath', () => {
    it('should return terms URL path for tenant network', () => {
      (comp as any).isTenantNetwork = true;
      expect((comp as any).getTermsUrlPath()).toBe('/pages/terms-of-service');
    });

    it('should return terms URL path for non-tenant network', () => {
      (comp as any).isTenantNetwork = false;
      expect((comp as any).getTermsUrlPath()).toBe('/p/terms');
    });
  });
});
