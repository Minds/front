import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OnboardingV5Component } from './onboarding-v5.component';
import { OnboardingV5Service } from '../services/onboarding-v5.service';
import { BehaviorSubject, Subscription, fromEvent } from 'rxjs';
import { MockComponent, MockService } from '../../../utils/mock';
import { IS_TENANT_NETWORK } from '../../../common/injection-tokens/tenant-injection-tokens';
import {
  HORIZONTAL_LOGO_PATH,
  MultiTenantConfigImageService,
} from '../../multi-tenant-network/services/config-image.service';
import { OnboardingV5MinimalModeService } from '../services/onboarding-v5-minimal-mode.service';

describe('OnboardingV5Component', () => {
  let comp: OnboardingV5Component;
  let fixture: ComponentFixture<OnboardingV5Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        OnboardingV5Component,
        MockComponent({
          selector: 'm-onboardingV5__stepper',
        }),
        MockComponent({
          selector: 'm-onboardingV5__verifyEmailContent',
          inputs: ['title', 'description', 'data'],
        }),
        MockComponent({
          selector: 'm-onboardingV5__tagSelectorContent',
          inputs: ['title', 'description', 'data'],
        }),
        MockComponent({
          selector: 'm-onboardingV5__radioSurveyContent',
          inputs: ['title', 'description', 'data'],
        }),
        MockComponent({
          selector: 'm-onboardingV5__channelRecommendationsContent',
          inputs: ['title', 'description', 'data', 'publisherType'],
        }),
        MockComponent({
          selector: 'm-featureCarousel',
          inputs: ['carouselItems$'],
        }),
        MockComponent({
          selector: 'm-onboardingV5__completedSplash',
        }),
        MockComponent({
          selector: 'm-sizeableLoadingSpinner',
          inputs: ['inProgress', 'spinnerHeight', 'spinnerWidth'],
        }),
      ],
      providers: [
        {
          provide: OnboardingV5Service,
          useValue: MockService(OnboardingV5Service),
        },
        {
          provide: MultiTenantConfigImageService,
          useValue: MockService(MultiTenantConfigImageService, {
            has: ['horizontalLogoPath$'],
            props: {
              horizontalLogoPath$: {
                get: () => new BehaviorSubject<string>(HORIZONTAL_LOGO_PATH),
              },
            },
          }),
        },
        {
          provide: OnboardingV5MinimalModeService,
          useValue: MockService(OnboardingV5MinimalModeService),
        },
        {
          provide: IS_TENANT_NETWORK,
          useValue: false,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingV5Component);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  it('should disable back navigation', () => {
    spyOn(history, 'pushState');
    spyOn(fromEvent(window, 'popstate'), 'subscribe').and.returnValue(
      new Subscription()
    );

    (comp as any).disableBackNavigation();

    expect(history.pushState).toHaveBeenCalledWith(null, null, location.href);
  });

  describe('isOnboardingMinimalMode', () => {
    it('should set isOnboardingMinimalMode to true', () => {
      (comp as any).onboardingMinimalModeService.shouldShow.and.returnValue(
        true
      );
      comp.ngOnInit();
      expect(comp.isOnboardingMinimalMode).toBeTrue();
    });

    it('should set isOnboardingMinimalMode to false', () => {
      (comp as any).onboardingMinimalModeService.shouldShow.and.returnValue(
        false
      );
      comp.ngOnInit();
      expect(comp.isOnboardingMinimalMode).toBeFalse();
    });
  });
});
