import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OnboardingV5StepperComponent } from './stepper.component';
import { OnboardingV5Service } from '../../services/onboarding-v5.service';
import { BehaviorSubject } from 'rxjs';
import { OnboardingStep } from '../../types/onboarding-v5.types';
import { MockService } from '../../../../utils/mock';
import { By } from '@angular/platform-browser';
import { ElementRef } from '@angular/core';

const mockOnboardingSteps: OnboardingStep[] = [
  {
    completed: true,
    stepType: 'step1',
    data: {
      __typename: 'ComponentOnboardingV5OnboardingStep',
      actionButton: null,
      carousel: null,
      description: null,
      groupSelector: null,
      id: null,
      radioSurvey: null,
      radioSurveyQuestion: null,
      skipButton: null,
      stepKey: null,
      stepType: null,
      tagSelector: null,
      title: null,
      userSelector: null,
      verifyEmailForm: null,
    },
  },
  {
    completed: false,
    stepType: 'step2',
    data: {
      __typename: 'ComponentOnboardingV5OnboardingStep',
      actionButton: null,
      carousel: null,
      description: null,
      groupSelector: null,
      id: null,
      radioSurvey: null,
      radioSurveyQuestion: null,
      skipButton: null,
      stepKey: null,
      stepType: null,
      tagSelector: null,
      title: null,
      userSelector: null,
      verifyEmailForm: null,
    },
  },
  {
    completed: false,
    stepType: 'step3',
    data: {
      __typename: 'ComponentOnboardingV5OnboardingStep',
      actionButton: null,
      carousel: null,
      description: null,
      groupSelector: null,
      id: null,
      radioSurvey: null,
      radioSurveyQuestion: null,
      skipButton: null,
      stepKey: null,
      stepType: null,
      tagSelector: null,
      title: null,
      userSelector: null,
      verifyEmailForm: null,
    },
  },
];

describe('OnboardingV5StepperComponent', () => {
  let comp: OnboardingV5StepperComponent;
  let fixture: ComponentFixture<OnboardingV5StepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OnboardingV5StepperComponent],
      providers: [
        {
          provide: OnboardingV5Service,
          useValue: MockService(OnboardingV5Service, {
            has: ['steps$', 'activeStep$'],
            props: {
              steps$: {
                get: () =>
                  new BehaviorSubject<OnboardingStep[]>(mockOnboardingSteps),
              },
              activeStep$: {
                get: () =>
                  new BehaviorSubject<OnboardingStep>(mockOnboardingSteps[1]),
              },
            },
          }),
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingV5StepperComponent);
    comp = fixture.componentInstance;

    (comp as any).service.steps$.next(mockOnboardingSteps);

    fixture.detectChanges();
  });

  it('should initialize', () => {
    expect(comp).toBeTruthy();
  });

  it('should have 3 steps', () => {
    const stepElements: ElementRef[] = fixture.debugElement.queryAll(
      By.css('.m-onboardingStepper__circle')
    );

    expect(stepElements).toBeDefined();
    expect(stepElements.length).toBe(3);
  });

  it('should show steps as completed', () => {
    let steps = mockOnboardingSteps;
    steps[0].completed = true;
    steps[1].completed = true;
    steps[2].completed = false;

    (comp as any).service.steps$.next(steps);
    fixture.detectChanges();

    const stepElements: ElementRef[] = fixture.debugElement.queryAll(
      By.css('.m-onboardingStepper__circle--completed')
    );

    expect(stepElements).toBeDefined();
    expect(stepElements.length).toBe(2);
  });

  it('should show one step as active', () => {
    const stepElements: ElementRef[] = fixture.debugElement.queryAll(
      By.css('.m-onboardingStepper__circle--active')
    );

    expect(stepElements).toBeDefined();
    expect(stepElements.length).toBe(1);
  });
});
