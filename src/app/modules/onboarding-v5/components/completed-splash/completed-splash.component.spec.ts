import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { OnboardingV5CompletedSplashComponent } from './completed-splash.component';
import { OnboardingV5Service } from '../../services/onboarding-v5.service';
import { ComponentOnboardingV5CompletionStep } from '../../../../../graphql/generated.strapi';
import { MockService } from '../../../../utils/mock';
import { STRAPI_URL } from '../../../../common/injection-tokens/url-injection-tokens';
import { BehaviorSubject } from 'rxjs';

describe('OnboardingV5CompletedSplashComponent', () => {
  let comp: OnboardingV5CompletedSplashComponent;
  let fixture: ComponentFixture<OnboardingV5CompletedSplashComponent>;

  const strapiUrlMock: string = 'https://example.minds.com';
  const completionStepMockData: ComponentOnboardingV5CompletionStep = {
    __typename: 'ComponentOnboardingV5CompletionStep',
    id: '~id~',
    media: {
      data: {
        attributes: {
          url: '/assets/image.jpeg',
          hash: '~hash~',
          mime: 'image/jpeg',
          name: 'image.jpeg',
          provider: 'local',
          size: 12345,
        },
      },
    },
    message: 'Completed!',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OnboardingV5CompletedSplashComponent],
      providers: [
        {
          provide: OnboardingV5Service,
          useValue: MockService(OnboardingV5Service, {
            has: ['completionStep$'],
            props: {
              completionStep$: {
                get: () =>
                  new BehaviorSubject<ComponentOnboardingV5CompletionStep>(
                    completionStepMockData
                  ),
              },
            },
          }),
        },
        { provide: STRAPI_URL, useValue: strapiUrlMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingV5CompletedSplashComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create the component', () => {
    expect(comp).toBeTruthy();
  });

  it('should initialize from completion step data', fakeAsync(() => {
    (comp as any).service.completionStep$.next(completionStepMockData);
    comp.ngOnInit();

    tick();
    comp.message = completionStepMockData.message;
    comp.imageAttributes = completionStepMockData.media.data.attributes;
  }));
});
