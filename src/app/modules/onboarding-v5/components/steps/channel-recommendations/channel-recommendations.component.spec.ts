import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OnboardingV5ChannelRecommendationsContentComponent } from './channel-recommendations.component';
import { OnboardingV5Service } from '../../../services/onboarding-v5.service';
import { MockComponent, MockService } from '../../../../../utils/mock';

describe('OnboardingV5ChannelRecommendationsContentComponent', () => {
  let comp: OnboardingV5ChannelRecommendationsContentComponent;
  let fixture: ComponentFixture<OnboardingV5ChannelRecommendationsContentComponent>;
  const data = {
    title: 'title',
    description: 'description',
    actionButton: {
      dataRef: 'data-ref2',
      id: 'id2',
      text: 'Continue',
    },
    skipButton: null,
    carousel: null,
    id: null,
    stepType: null,
    stepKey: null,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        OnboardingV5ChannelRecommendationsContentComponent,
        MockComponent({
          selector: 'm-loadingSpinner',
          inputs: ['inProgress'],
        }),
        MockComponent({
          selector: 'm-channelRecommendation',
          inputs: [
            'location',
            'isOnboarding',
            'noOuterPadding',
            'listSize',
            'publisherType',
          ],
          outputs: ['subscribed', 'unsubscribed', 'loaded'],
        }),
        MockComponent({
          selector: 'm-onboardingV5__footer',
          inputs: ['disabledActionButton', 'actionButton', 'skipButton'],
          outputs: ['actionButtonClick', 'skipButtonClick'],
        }),
      ],
      providers: [
        {
          provide: OnboardingV5Service,
          useValue: MockService(OnboardingV5Service),
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(
      OnboardingV5ChannelRecommendationsContentComponent
    );
    comp = fixture.componentInstance;

    comp.title = 'title';
    comp.description = 'description';
    comp.data = data;
    comp.publisherType = 'user';

    (comp as any).subscriptionsCount$.next(0);

    fixture.detectChanges();
  });

  it('should initialize', () => {
    expect(comp).toBeTruthy();
  });

  it('should call to continue on action button click', () => {
    comp.onActionButtonClick();
    expect((comp as any).service.continue).toHaveBeenCalled();
  });

  it('should call to continue on skip button click', () => {
    comp.onSkipButtonClick();
    expect((comp as any).service.continue).toHaveBeenCalled();
  });

  it('should increment subscription count on onSubscribed call', () => {
    (comp as any).subscriptionsCount$.next(0);

    comp.onSubscribed();
    expect((comp as any).subscriptionsCount$.getValue()).toBe(1);

    comp.onSubscribed();
    expect((comp as any).subscriptionsCount$.getValue()).toBe(2);

    comp.onSubscribed();
    expect((comp as any).subscriptionsCount$.getValue()).toBe(3);
  });

  it('should decrement subscription count on onUnsubscribed call to a minimum of 0', () => {
    (comp as any).subscriptionsCount$.next(2);

    comp.onUnsubscribed();
    expect((comp as any).subscriptionsCount$.getValue()).toBe(1);

    comp.onUnsubscribed();
    expect((comp as any).subscriptionsCount$.getValue()).toBe(0);

    comp.onUnsubscribed();
    expect((comp as any).subscriptionsCount$.getValue()).toBe(0);
  });

  it('should set loaded$ on loaded call', () => {
    comp.onLoaded(false);
    expect(comp.loaded$.getValue()).toBe(false);

    comp.onLoaded(true);
    expect(comp.loaded$.getValue()).toBe(true);
  });
});
