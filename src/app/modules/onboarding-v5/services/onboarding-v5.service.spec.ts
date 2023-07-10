import {
  TestBed,
  discardPeriodicTasks,
  fakeAsync,
  flush,
  tick,
} from '@angular/core/testing';
import { OnboardingV5Service } from './onboarding-v5.service';
import { MockService } from '../../../utils/mock';
import { AuthRedirectService } from '../../../common/services/auth-redirect.service';
import {
  ComponentOnboardingV5CompletionStep,
  ComponentOnboardingV5OnboardingStep,
  FetchOnboardingV5VersionsGQL,
} from '../../../../graphql/generated.strapi';
import {
  CompleteOnboardingStepGQL,
  GetOnboardingStateGQL,
  GetOnboardingStepProgressGQL,
  SetOnboardingStateGQL,
} from '../../../../graphql/generated.engine';
import { OnboardingV5CompletionStorageService } from './onboarding-v5-completion-storage.service';
import { ConfigsService } from '../../../common/services/configs.service';
import { Session } from '../../../services/session';
import { STRAPI_URL } from '../../../common/injection-tokens/url-injection-tokens';
import { of, take, throwError } from 'rxjs';
import { CarouselItem } from '../../../common/components/feature-carousel/feature-carousel.component';
import { OnboardingStep } from '../types/onboarding-v5.types';
import userMock from '../../../mocks/responses/user.mock';
import { mockOnboardingV5VersionsData } from './mocks/onboardingV5Versions.mock';

const mockActiveStep: OnboardingStep = {
  completed: true,
  stepType: 'verify-email',
  data: mockOnboardingV5VersionsData.data.onboardingV5Versions.data[0]
    .attributes.steps[0] as ComponentOnboardingV5OnboardingStep,
};

describe('OnboardingV5Service', () => {
  let service: OnboardingV5Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: OnboardingV5Service,
          useValue: MockService(OnboardingV5Service),
        },
        {
          provide: AuthRedirectService,
          useValue: MockService(AuthRedirectService),
        },
        {
          provide: FetchOnboardingV5VersionsGQL,
          useValue: jasmine.createSpyObj<FetchOnboardingV5VersionsGQL>([
            'fetch',
          ]),
        },
        {
          provide: GetOnboardingStateGQL,
          useValue: jasmine.createSpyObj<GetOnboardingStateGQL>(['fetch']),
        },
        {
          provide: SetOnboardingStateGQL,
          useValue: jasmine.createSpyObj<SetOnboardingStateGQL>(['mutate']),
        },
        {
          provide: GetOnboardingStepProgressGQL,
          useValue: jasmine.createSpyObj<GetOnboardingStepProgressGQL>([
            'fetch',
          ]),
        },
        {
          provide: CompleteOnboardingStepGQL,
          useValue: jasmine.createSpyObj<CompleteOnboardingStepGQL>(['mutate']),
        },
        {
          provide: OnboardingV5CompletionStorageService,
          useValue: MockService(OnboardingV5CompletionStorageService),
        },
        {
          provide: ConfigsService,
          useValue: MockService(ConfigsService),
        },
        {
          provide: Session,
          useValue: MockService(Session),
        },
        {
          provide: STRAPI_URL,
          useValue: 'https://example.minds.com',
        },
        OnboardingV5Service,
      ],
    });
    service = TestBed.inject(OnboardingV5Service);
    service.activeStep$.next(mockActiveStep);
    (service as any).configs.get
      .withArgs('onboarding_v5_release_timestamp')
      .and.returnValue(999);
    (service as any).session.getLoggedInUser.and.returnValue(userMock);
    (service as any).completionStorage.isCompleted.and.returnValue(false);
    (service as any).firstLoad = false;
  });

  afterEach(() => {
    service.ngOnDestroy();
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  describe('activeStepCarouselItems$', () => {
    it('should determine there is no carousel items for the currently active step when there are none', (done: DoneFn) => {
      let activeStep: OnboardingStep = mockActiveStep;
      activeStep.data.carousel = [];
      service.activeStep$.next(activeStep);

      (service as any).activeStepCarouselItems$
        .pipe(take(1))
        .subscribe((activeStepCarouselItems: CarouselItem[]) => {
          expect(activeStepCarouselItems).toEqual([]);
          done();
        });
    });

    it('should determine there is carousel items for the currently active step', (done: DoneFn) => {
      let activeStep: OnboardingStep = mockActiveStep;
      activeStep.data.carousel = [
        {
          id: '1',
          title: 'title',
          media: {
            data: {
              attributes: {
                url: '/url',
                alternativeText: 'altText',
                hash: 'hash',
                mime: 'mine',
                name: 'name',
                provider: 'provider',
                size: 123,
              },
            },
          },
        },
        {
          id: '2',
          title: 'title2',
          media: {
            data: {
              attributes: {
                url: '/url2',
                alternativeText: 'altText2',
                hash: 'hash2',
                mime: 'mine2',
                name: 'name2',
                provider: 'provider2',
                size: 234,
              },
            },
          },
        },
      ];
      service.activeStep$.next(activeStep);

      (service as any).activeStepCarouselItems$
        .pipe(take(1))
        .subscribe((activeStepCarouselItems: CarouselItem[]) => {
          expect(activeStepCarouselItems).toEqual([
            {
              title: 'title',
              media: {
                fullUrl: 'https://example.minds.com/url',
                altText: 'altText',
              },
            },
            {
              title: 'title2',
              media: {
                fullUrl: 'https://example.minds.com/url2',
                altText: 'altText2',
              },
            },
          ]);
          done();
        });
    });
  });

  describe('hasCompletedOnboarding', () => {
    it('should determine if a user has completed onboarding because we have stored state that says they have', async () => {
      (service as any).completionStorage.isCompleted.and.returnValue(true);

      expect(await service.hasCompletedOnboarding()).toBe(true);
      expect((service as any).completionStorage.isCompleted).toHaveBeenCalled();
    });

    it('should determine if a user has completed onboarding because they existed pre onboarding-v5 release', async () => {
      (service as any).completionStorage.isCompleted.and.returnValue(false);
      let _userMock = userMock;
      _userMock.time_created = 999;
      (service as any).session.getLoggedInUser.and.returnValue(_userMock);
      Object.defineProperty(service, 'releaseTimestamp', {
        value: 32518935543,
      });

      expect(await service.hasCompletedOnboarding()).toBe(true);
      expect((service as any).completionStorage.isCompleted).toHaveBeenCalled();
      expect(
        (service as any).completionStorage.setAsCompleted
      ).toHaveBeenCalledWith(_userMock.guid);
    });

    it('should determine that a user has completed onboarding because the servers returns that they have', async () => {
      (service as any).completionStorage.isCompleted.and.returnValue(false);
      let _userMock = userMock;
      _userMock.time_created = 999;
      (service as any).session.getLoggedInUser.and.returnValue(_userMock);
      Object.defineProperty(service, 'releaseTimestamp', { value: 1 });
      (service as any).getOnboardingStateGQL.fetch.and.returnValue(
        of({
          data: {
            onboardingState: {
              completedAt: 99,
            },
          },
        })
      );
    });

    it('should determine that a user has completed onboarding because the servers returns no onboarding state (not started)', async () => {
      (service as any).completionStorage.isCompleted.and.returnValue(false);
      let _userMock = userMock;
      _userMock.time_created = 999;
      (service as any).session.getLoggedInUser.and.returnValue(_userMock);
      Object.defineProperty(service, 'releaseTimestamp', { value: 1 });
      (service as any).getOnboardingStateGQL.fetch.and.returnValue(
        of({
          data: {
            onboardingState: null,
          },
        })
      );

      expect(await service.hasCompletedOnboarding()).toBe(true);
      expect((service as any).completionStorage.isCompleted).toHaveBeenCalled();
      expect((service as any).getOnboardingStateGQL.fetch).toHaveBeenCalled();
      expect(
        (service as any).completionStorage.setAsCompleted
      ).not.toHaveBeenCalled();
    });

    it('should fallback on error fetching to presume that a user has completed onboarding', async () => {
      (service as any).completionStorage.isCompleted.and.returnValue(false);
      let _userMock = userMock;
      _userMock.time_created = 999;
      (service as any).session.getLoggedInUser.and.returnValue(_userMock);
      Object.defineProperty(service, 'releaseTimestamp', { value: 1 });
      (service as any).getOnboardingStateGQL.fetch.and.returnValue(
        throwError(() => new Error('error'))
      );

      expect(await service.hasCompletedOnboarding()).toBe(true);
      expect((service as any).completionStorage.isCompleted).toHaveBeenCalled();
      expect((service as any).getOnboardingStateGQL.fetch).toHaveBeenCalled();
      expect(
        (service as any).completionStorage.setAsCompleted
      ).not.toHaveBeenCalledWith(_userMock.guid);
    });

    it('should determine if a user has NOT completed onboarding because this is the first load', async () => {
      (service as any).firstLoad = true;
      expect(await service.hasCompletedOnboarding()).toBe(false);
      expect(
        (service as any).completionStorage.setAsCompleted
      ).not.toHaveBeenCalled();
    });

    it('should determine if a user has NOT completed onboarding because the servers returns that they have NOT', async () => {
      (service as any).completionStorage.isCompleted.and.returnValue(false);
      let _userMock = userMock;
      _userMock.time_created = 999;
      (service as any).session.getLoggedInUser.and.returnValue(_userMock);
      Object.defineProperty(service, 'releaseTimestamp', { value: 1 });
      (service as any).getOnboardingStateGQL.fetch.and.returnValue(
        of({
          data: {
            onboardingState: {
              completedAt: null,
            },
          },
        })
      );

      expect(await service.hasCompletedOnboarding()).toBe(false);
      expect((service as any).completionStorage.isCompleted).toHaveBeenCalled();
      expect((service as any).getOnboardingStateGQL.fetch).toHaveBeenCalled();
      expect(
        (service as any).completionStorage.setAsCompleted
      ).not.toHaveBeenCalledWith(_userMock.guid);
    });
  });

  describe('setOnboardingCompletedState', () => {
    it('should set onboarding completed state to true with no user param provided', async () => {
      (service as any).setOnboardingStateGQL.mutate.and.returnValue(
        of({ completed: true })
      );

      await service.setOnboardingCompletedState(true);

      expect(
        (service as any).completionStorage.setAsCompleted
      ).toHaveBeenCalledWith(userMock.guid);
      expect(
        (service as any).setOnboardingStateGQL.mutate
      ).toHaveBeenCalledWith({ completed: true });
    });

    it('should set onboarding completed state to true with a user param provided', async () => {
      let user = userMock;
      userMock.guid = '2345';

      (service as any).setOnboardingStateGQL.mutate.and.returnValue(
        of({ completed: true })
      );

      await service.setOnboardingCompletedState(true, user);

      expect(
        (service as any).completionStorage.setAsCompleted
      ).toHaveBeenCalledWith(userMock.guid);
      expect(
        (service as any).setOnboardingStateGQL.mutate
      ).toHaveBeenCalledWith({ completed: true });
    });

    it('should set onboarding completed state to false', async () => {
      (service as any).setOnboardingStateGQL.mutate.and.returnValue(
        of({ completed: false })
      );
      (service as any).firstLoad = false;

      await service.setOnboardingCompletedState(false);

      expect(
        (service as any).completionStorage.setAsCompleted
      ).not.toHaveBeenCalledWith(userMock.guid);
      expect(
        (service as any).setOnboardingStateGQL.mutate
      ).toHaveBeenCalledWith({ completed: false });
      expect((service as any).firstLoad).toBeTrue();
    });
  });

  describe('start', () => {
    it('should start onboarding when progress check is not skipped and user has no onboarding progress', async () => {
      (service as any).getOnboardingStepProgressGQL.fetch.and.returnValue(
        of({
          data: {
            onboardingStepProgress: [],
          },
        })
      );
      (service as any).fetchOnboardingV5VersionsGql.fetch.and.returnValue(
        of(mockOnboardingV5VersionsData)
      );
      (service as any).firstLoad = false;

      await service.start();

      expect(
        (service as any).getOnboardingStepProgressGQL.fetch
      ).toHaveBeenCalled();
      expect(service.steps$.getValue()).toEqual([
        {
          completed: false,
          stepType: 'verify_email',
          data: mockOnboardingV5VersionsData.data.onboardingV5Versions.data[0]
            .attributes.steps[0] as ComponentOnboardingV5OnboardingStep,
        },
        {
          completed: false,
          stepType: 'tag_selector',
          data: mockOnboardingV5VersionsData.data.onboardingV5Versions.data[0]
            .attributes.steps[1] as ComponentOnboardingV5OnboardingStep,
        },
        {
          completed: false,
          stepType: 'survey',
          data: mockOnboardingV5VersionsData.data.onboardingV5Versions.data[0]
            .attributes.steps[2] as ComponentOnboardingV5OnboardingStep,
        },
        {
          completed: false,
          stepType: 'user_selector',
          data: mockOnboardingV5VersionsData.data.onboardingV5Versions.data[0]
            .attributes.steps[3] as ComponentOnboardingV5OnboardingStep,
        },
        {
          completed: false,
          stepType: 'group_selector',
          data: mockOnboardingV5VersionsData.data.onboardingV5Versions.data[0]
            .attributes.steps[4] as ComponentOnboardingV5OnboardingStep,
        },
      ]);
      expect(service.activeStep$.getValue()).toEqual({
        completed: false,
        stepType: 'verify_email',
        data: mockOnboardingV5VersionsData.data.onboardingV5Versions.data[0]
          .attributes.steps[0] as ComponentOnboardingV5OnboardingStep,
      });
      expect(service.completionStep$.getValue()).toEqual(
        mockOnboardingV5VersionsData.data.onboardingV5Versions.data[0]
          .attributes.completionStep as ComponentOnboardingV5CompletionStep
      );
    });

    it('should start onboarding when progress check is not skipped and user is part way through onboarding', async () => {
      (service as any).getOnboardingStepProgressGQL.fetch.and.returnValue(
        of({
          data: {
            onboardingStepProgress: [
              {
                userGuid: '123',
                stepKey: 'verify_email',
                stepType: 'verify_email',
                completedAt: 999,
              },
              {
                userGuid: '123',
                stepKey: 'tag_selector',
                stepType: 'tag_selector',
                completedAt: null,
              },
            ],
          },
        })
      );
      (service as any).fetchOnboardingV5VersionsGql.fetch.and.returnValue(
        of(mockOnboardingV5VersionsData)
      );
      (service as any).firstLoad = false;

      await service.start();

      expect(
        (service as any).getOnboardingStepProgressGQL.fetch
      ).toHaveBeenCalled();
      expect(service.steps$.getValue()).toEqual([
        {
          completed: true,
          stepType: 'verify_email',
          data: mockOnboardingV5VersionsData.data.onboardingV5Versions.data[0]
            .attributes.steps[0] as ComponentOnboardingV5OnboardingStep,
        },
        {
          completed: false,
          stepType: 'tag_selector',
          data: mockOnboardingV5VersionsData.data.onboardingV5Versions.data[0]
            .attributes.steps[1] as ComponentOnboardingV5OnboardingStep,
        },
        {
          completed: false,
          stepType: 'survey',
          data: mockOnboardingV5VersionsData.data.onboardingV5Versions.data[0]
            .attributes.steps[2] as ComponentOnboardingV5OnboardingStep,
        },
        {
          completed: false,
          stepType: 'user_selector',
          data: mockOnboardingV5VersionsData.data.onboardingV5Versions.data[0]
            .attributes.steps[3] as ComponentOnboardingV5OnboardingStep,
        },
        {
          completed: false,
          stepType: 'group_selector',
          data: mockOnboardingV5VersionsData.data.onboardingV5Versions.data[0]
            .attributes.steps[4] as ComponentOnboardingV5OnboardingStep,
        },
      ]);
      expect(service.activeStep$.getValue()).toEqual({
        completed: false,
        stepType: 'tag_selector',
        data: mockOnboardingV5VersionsData.data.onboardingV5Versions.data[0]
          .attributes.steps[1] as ComponentOnboardingV5OnboardingStep,
      });
      expect(service.completionStep$.getValue()).toEqual(
        mockOnboardingV5VersionsData.data.onboardingV5Versions.data[0]
          .attributes.completionStep as ComponentOnboardingV5CompletionStep
      );
    });

    it('should start onboarding when progress check is not skipped and user is part way through onboarding, and reorder so completed steps are first', async () => {
      (service as any).getOnboardingStepProgressGQL.fetch.and.returnValue(
        of({
          data: {
            onboardingStepProgress: [
              {
                userGuid: '123',
                stepKey: 'verify_email',
                stepType: 'verify_email',
                completedAt: null,
              },
              {
                userGuid: '123',
                stepKey: 'tag_selector',
                stepType: 'tag_selector',
                completedAt: 999,
              },
            ],
          },
        })
      );
      (service as any).fetchOnboardingV5VersionsGql.fetch.and.returnValue(
        of(mockOnboardingV5VersionsData)
      );
      (service as any).firstLoad = false;

      await service.start();

      expect(
        (service as any).getOnboardingStepProgressGQL.fetch
      ).toHaveBeenCalled();
      expect(service.steps$.getValue()).toEqual([
        {
          completed: true,
          stepType: 'tag_selector',
          data: mockOnboardingV5VersionsData.data.onboardingV5Versions.data[0]
            .attributes.steps[1] as ComponentOnboardingV5OnboardingStep,
        },
        {
          completed: false,
          stepType: 'verify_email',
          data: mockOnboardingV5VersionsData.data.onboardingV5Versions.data[0]
            .attributes.steps[0] as ComponentOnboardingV5OnboardingStep,
        },
        {
          completed: false,
          stepType: 'survey',
          data: mockOnboardingV5VersionsData.data.onboardingV5Versions.data[0]
            .attributes.steps[2] as ComponentOnboardingV5OnboardingStep,
        },
        {
          completed: false,
          stepType: 'user_selector',
          data: mockOnboardingV5VersionsData.data.onboardingV5Versions.data[0]
            .attributes.steps[3] as ComponentOnboardingV5OnboardingStep,
        },
        {
          completed: false,
          stepType: 'group_selector',
          data: mockOnboardingV5VersionsData.data.onboardingV5Versions.data[0]
            .attributes.steps[4] as ComponentOnboardingV5OnboardingStep,
        },
      ]);
      expect(service.activeStep$.getValue()).toEqual({
        completed: false,
        stepType: 'verify_email',
        data: mockOnboardingV5VersionsData.data.onboardingV5Versions.data[0]
          .attributes.steps[0] as ComponentOnboardingV5OnboardingStep,
      });
      expect(service.completionStep$.getValue()).toEqual(
        mockOnboardingV5VersionsData.data.onboardingV5Versions.data[0]
          .attributes.completionStep as ComponentOnboardingV5CompletionStep
      );
    });

    it('should start onboarding when progress check IS skipped and user has no onboarding progress', async () => {
      (service as any).fetchOnboardingV5VersionsGql.fetch.and.returnValue(
        of(mockOnboardingV5VersionsData)
      );
      (service as any).firstLoad = true;

      await service.start();

      expect(
        (service as any).getOnboardingStepProgressGQL.fetch
      ).not.toHaveBeenCalled();
      expect(service.steps$.getValue()).toEqual([
        {
          completed: false,
          stepType: 'verify_email',
          data: mockOnboardingV5VersionsData.data.onboardingV5Versions.data[0]
            .attributes.steps[0] as ComponentOnboardingV5OnboardingStep,
        },
        {
          completed: false,
          stepType: 'tag_selector',
          data: mockOnboardingV5VersionsData.data.onboardingV5Versions.data[0]
            .attributes.steps[1] as ComponentOnboardingV5OnboardingStep,
        },
        {
          completed: false,
          stepType: 'survey',
          data: mockOnboardingV5VersionsData.data.onboardingV5Versions.data[0]
            .attributes.steps[2] as ComponentOnboardingV5OnboardingStep,
        },
        {
          completed: false,
          stepType: 'user_selector',
          data: mockOnboardingV5VersionsData.data.onboardingV5Versions.data[0]
            .attributes.steps[3] as ComponentOnboardingV5OnboardingStep,
        },
        {
          completed: false,
          stepType: 'group_selector',
          data: mockOnboardingV5VersionsData.data.onboardingV5Versions.data[0]
            .attributes.steps[4] as ComponentOnboardingV5OnboardingStep,
        },
      ]);
      expect(service.activeStep$.getValue()).toEqual({
        completed: false,
        stepType: 'verify_email',
        data: mockOnboardingV5VersionsData.data.onboardingV5Versions.data[0]
          .attributes.steps[0] as ComponentOnboardingV5OnboardingStep,
      });
      expect(service.completionStep$.getValue()).toEqual(
        mockOnboardingV5VersionsData.data.onboardingV5Versions.data[0]
          .attributes.completionStep as ComponentOnboardingV5CompletionStep
      );
    });

    it('should redirect and dismiss when an error occurs whilst starting onboarding', async () => {
      spyOn((service as any).dismiss$, 'next').and.callThrough();
      (service as any).getOnboardingStepProgressGQL.fetch.and.returnValue(
        throwError(() => new Error('error'))
      );
      (service as any).fetchOnboardingV5VersionsGql.fetch.and.returnValue(
        of(mockOnboardingV5VersionsData)
      );
      (service as any).firstLoad = false;

      await service.start();

      expect(
        (service as any).getOnboardingStepProgressGQL.fetch
      ).toHaveBeenCalled();
      expect((service as any).authRedirect.redirect).toHaveBeenCalled();
      expect((service as any).dismiss$.next).toHaveBeenCalled();
    });
  });

  describe('continue', () => {
    it('should complete current onboarding step and move to next step', fakeAsync(() => {
      (service as any).completeOnboardingStepGQL.mutate.and.returnValue(
        of(true)
      );
      service.steps$.next([
        {
          completed: false,
          stepType: 'verify_email',
          data: mockOnboardingV5VersionsData.data.onboardingV5Versions.data[0]
            .attributes.steps[0] as ComponentOnboardingV5OnboardingStep,
        },
        {
          completed: false,
          stepType: 'tag_selector',
          data: mockOnboardingV5VersionsData.data.onboardingV5Versions.data[0]
            .attributes.steps[1] as ComponentOnboardingV5OnboardingStep,
        },
        {
          completed: false,
          stepType: 'survey',
          data: mockOnboardingV5VersionsData.data.onboardingV5Versions.data[0]
            .attributes.steps[2] as ComponentOnboardingV5OnboardingStep,
        },
        {
          completed: false,
          stepType: 'user_selector',
          data: mockOnboardingV5VersionsData.data.onboardingV5Versions.data[0]
            .attributes.steps[3] as ComponentOnboardingV5OnboardingStep,
        },
        {
          completed: false,
          stepType: 'group_selector',
          data: mockOnboardingV5VersionsData.data.onboardingV5Versions.data[0]
            .attributes.steps[4] as ComponentOnboardingV5OnboardingStep,
        },
      ]);

      (service as any).activeStep$.next({
        completed: false,
        stepType: 'verify_email',
        data: mockOnboardingV5VersionsData.data.onboardingV5Versions.data[0]
          .attributes.steps[0] as ComponentOnboardingV5OnboardingStep,
      });

      service.continue();
      tick();

      expect((service as any).activeStep$.getValue()).toEqual({
        completed: false,
        stepType: 'tag_selector',
        data: mockOnboardingV5VersionsData.data.onboardingV5Versions.data[0]
          .attributes.steps[1] as ComponentOnboardingV5OnboardingStep,
      });
      expect(
        (service as any).completeOnboardingStepGQL.mutate
      ).toHaveBeenCalledWith({
        stepType: 'verify_email',
        stepKey: 'verify_email',
        additionalData: [],
      });
    }));

    it('should complete current onboarding step and move to next step, passing additional data', fakeAsync(() => {
      const additionalData = {
        testKey: 'testValue',
      };
      (service as any).completeOnboardingStepGQL.mutate.and.returnValue(
        of(true)
      );
      service.steps$.next([
        {
          completed: false,
          stepType: 'verify_email',
          data: mockOnboardingV5VersionsData.data.onboardingV5Versions.data[0]
            .attributes.steps[0] as ComponentOnboardingV5OnboardingStep,
        },
        {
          completed: false,
          stepType: 'tag_selector',
          data: mockOnboardingV5VersionsData.data.onboardingV5Versions.data[0]
            .attributes.steps[1] as ComponentOnboardingV5OnboardingStep,
        },
        {
          completed: false,
          stepType: 'survey',
          data: mockOnboardingV5VersionsData.data.onboardingV5Versions.data[0]
            .attributes.steps[2] as ComponentOnboardingV5OnboardingStep,
        },
        {
          completed: false,
          stepType: 'user_selector',
          data: mockOnboardingV5VersionsData.data.onboardingV5Versions.data[0]
            .attributes.steps[3] as ComponentOnboardingV5OnboardingStep,
        },
        {
          completed: false,
          stepType: 'group_selector',
          data: mockOnboardingV5VersionsData.data.onboardingV5Versions.data[0]
            .attributes.steps[4] as ComponentOnboardingV5OnboardingStep,
        },
      ]);

      (service as any).activeStep$.next({
        completed: false,
        stepType: 'verify_email',
        data: mockOnboardingV5VersionsData.data.onboardingV5Versions.data[0]
          .attributes.steps[0] as ComponentOnboardingV5OnboardingStep,
      });

      service.continue(additionalData);
      tick();

      expect((service as any).activeStep$.getValue()).toEqual({
        completed: false,
        stepType: 'tag_selector',
        data: mockOnboardingV5VersionsData.data.onboardingV5Versions.data[0]
          .attributes.steps[1] as ComponentOnboardingV5OnboardingStep,
      });
      expect(
        (service as any).completeOnboardingStepGQL.mutate
      ).toHaveBeenCalledWith({
        stepType: 'verify_email',
        stepKey: 'verify_email',
        additionalData: [
          {
            key: 'testKey',
            value: 'testValue',
          },
        ],
      });
    }));

    it('should complete current onboarding step and move to completion step', fakeAsync(() => {
      (service as any).completeOnboardingStepGQL.mutate.and.returnValue(
        of(true)
      );
      (service as any).setOnboardingStateGQL.mutate.and.returnValue(
        of({ completed: true })
      );
      service.steps$.next([
        {
          completed: true,
          stepType: 'verify_email',
          data: mockOnboardingV5VersionsData.data.onboardingV5Versions.data[0]
            .attributes.steps[0] as ComponentOnboardingV5OnboardingStep,
        },
        {
          completed: true,
          stepType: 'tag_selector',
          data: mockOnboardingV5VersionsData.data.onboardingV5Versions.data[0]
            .attributes.steps[1] as ComponentOnboardingV5OnboardingStep,
        },
        {
          completed: true,
          stepType: 'survey',
          data: mockOnboardingV5VersionsData.data.onboardingV5Versions.data[0]
            .attributes.steps[2] as ComponentOnboardingV5OnboardingStep,
        },
        {
          completed: true,
          stepType: 'user_selector',
          data: mockOnboardingV5VersionsData.data.onboardingV5Versions.data[0]
            .attributes.steps[3] as ComponentOnboardingV5OnboardingStep,
        },
        {
          completed: true,
          stepType: 'group_selector',
          data: mockOnboardingV5VersionsData.data.onboardingV5Versions.data[0]
            .attributes.steps[4] as ComponentOnboardingV5OnboardingStep,
        },
      ]);

      (service as any).activeStep$.next({
        completed: true,
        stepType: 'group_selector',
        data: mockOnboardingV5VersionsData.data.onboardingV5Versions.data[0]
          .attributes.steps[4] as ComponentOnboardingV5OnboardingStep,
      });

      service.continue();
      tick();

      flush();
      discardPeriodicTasks();

      expect(
        (service as any).completionStorage.setAsCompleted
      ).toHaveBeenCalledWith(userMock.guid);
      expect(
        (service as any).setOnboardingStateGQL.mutate
      ).toHaveBeenCalledWith({ completed: true });
      expect(
        (service as any).completeOnboardingStepGQL.mutate
      ).toHaveBeenCalledWith({
        stepType: 'group_selector',
        stepKey: 'group_selector',
        additionalData: [],
      });
    }));
  });
});
