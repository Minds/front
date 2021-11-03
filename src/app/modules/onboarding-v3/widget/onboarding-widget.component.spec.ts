import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormToastService } from '../../../common/services/form-toast.service';
import { MockService } from '../../../utils/mock';
import { OnboardingV3WidgetComponent } from './onboarding-widget.component';
import { OnboardingV3Service } from '../onboarding-v3.service';
import { OnboardingV3PanelService } from '../panel/onboarding-panel.service';
import { featuresServiceMock } from '../../../../tests/features-service-mock.spec';
import { Injector } from '@angular/core';
import { ModalService } from '../../composer/components/modal/modal.service';
import { BehaviorSubject } from 'rxjs';
import { IfFeatureDirective } from '../../../common/directives/if-feature.directive';
import { FeaturesService } from '../../../services/features.service';
import { EmailConfirmationService } from '../../../common/components/email-confirmation/email-confirmation.service';

describe('OnboardingV3WidgetComponent', () => {
  let comp: OnboardingV3WidgetComponent;
  let fixture: ComponentFixture<OnboardingV3WidgetComponent>;

  const progress$ = new BehaviorSubject<string>('');

  const onboardingServiceMock: any = MockService(OnboardingV3Service, {
    has: ['progress$'],
    props: {
      progress$: { get: () => progress$ },
    },
  });

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [OnboardingV3WidgetComponent, IfFeatureDirective],
        providers: [
          {
            provide: OnboardingV3Service,
            useValue: onboardingServiceMock,
          },
          {
            provide: OnboardingV3PanelService,
            useValue: MockService(OnboardingV3PanelService),
          },
          { provide: ModalService, useValue: MockService(ModalService) },
          { provide: Injector, useValue: MockService(Injector) },
          {
            provide: FormToastService,
            useValue: MockService(FormToastService),
          },
          {
            provide: FeaturesService,
            useValue: MockService(FeaturesService),
          },
          {
            provide: EmailConfirmationService,
            useValue: MockService(EmailConfirmationService),
          },
        ],
        imports: [],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    featuresServiceMock.mock('onboarding-october-2020', true);

    fixture = TestBed.createComponent(OnboardingV3WidgetComponent);

    comp = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  it('should call to load on init', () => {
    expect((comp as any).onboarding.load).toHaveBeenCalled();
  });

  it('should get progress from service', () => {
    let response = { status: 'success' };
    (comp as any).onboarding.progress$ = new BehaviorSubject<any>(response);

    comp.progress$.subscribe(val => {
      expect(val).toBe(response);
    });
  });

  // awkward with dev mode.
  xit('should send message through toast service when email verification clicked', () => {
    comp.onTaskClick('VerifyEmailStep');
    expect((comp as any).toast.inform).toHaveBeenCalledWith(
      'Check your inbox for a verification email from us.'
    );
  });

  // Unhandled promise error - can't call present on null
  xit('should open composer modal when create a post clicked', () => {
    comp.onTaskClick('CreatePostStep');

    // chain called that presents modal
    expect((comp as any).composerModal.setInjector).toHaveBeenCalledWith(
      (comp as any).injector
    );
  });
});
