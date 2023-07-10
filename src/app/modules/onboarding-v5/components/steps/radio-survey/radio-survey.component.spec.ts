import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { OnboardingV5RadioSurveyContentComponent } from './radio-survey.component';
import { ComponentOnboardingV5OnboardingStep } from '../../../../../../graphql/generated.strapi';
import { OnboardingV5Service } from '../../../services/onboarding-v5.service';
import { FeatureCarouselService } from '../../../../../common/components/feature-carousel/feature-carousel.service';
import { AnalyticsService } from '../../../../../services/analytics';
import { MockComponent, MockService } from '../../../../../utils/mock';
import { BehaviorSubject } from 'rxjs';

describe('OnboardingV5RadioSurveyContentComponent', () => {
  let comp: OnboardingV5RadioSurveyContentComponent;
  let fixture: ComponentFixture<OnboardingV5RadioSurveyContentComponent>;

  const mockData: ComponentOnboardingV5OnboardingStep = {
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
    stepKey: 'survey',
    radioSurveyQuestion: 'question',
    radioSurvey: [
      {
        __typename: 'ComponentOnboardingV5RadioOption',
        id: '0',
        optionDescription: 'optionDescription0',
        optionKey: 'optionKey0',
        optionTitle: 'optionTitle0',
      },
      {
        __typename: 'ComponentOnboardingV5RadioOption',
        id: '1',
        optionDescription: 'optionDescription1',
        optionKey: 'optionKey1',
        optionTitle: 'optionTitle1',
      },
      {
        __typename: 'ComponentOnboardingV5RadioOption',
        id: '2',
        optionDescription: 'optionDescription2',
        optionKey: 'optionKey2',
        optionTitle: 'optionTitle2',
      },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [
        OnboardingV5RadioSurveyContentComponent,
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
        {
          provide: FeatureCarouselService,
          useValue: MockService(OnboardingV5Service, {
            has: ['jumpToItemIndex$'],
            props: {
              jumpToItemIndex$: {
                get: () => new BehaviorSubject<number>(0),
              },
            },
          }),
        },
        { provide: AnalyticsService, useValue: MockService(AnalyticsService) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingV5RadioSurveyContentComponent);
    comp = fixture.componentInstance;
    comp.title = 'title';
    comp.description = 'description';
    comp.data = mockData;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(comp).toBeTruthy();
  });

  it('should create the form group', () => {
    expect(comp.formGroup).toBeTruthy();
    expect(comp.formGroup instanceof FormGroup).toBeTruthy();
    expect(comp.formGroup.controls['selectedKey']).toBeTruthy();
    expect(
      comp.formGroup.controls['selectedKey'] instanceof FormControl
    ).toBeTruthy();
  });

  it('should handle action button click for onboarding interest survey', () => {
    const clonedData: ComponentOnboardingV5OnboardingStep = comp.data;
    clonedData.stepKey = 'onboarding_interest_survey';
    comp.formGroup.get('selectedKey').setValue('optionKey0');

    comp.onActionButtonClick();
    fixture.detectChanges();

    expect((comp as any).analytics.trackClick).toHaveBeenCalledWith(
      'onboarding-segment--onboarding_interest_survey--optionKey0'
    );
    expect((comp as any).service.continue).toHaveBeenCalledWith({
      onboarding_interest: 'optionKey0',
    });
  });

  it('should handle action button click for a survey that is NOT an onboarding interest survey', () => {
    const clonedData: ComponentOnboardingV5OnboardingStep = comp.data;
    clonedData.stepKey = 'not_an_onboarding_interest_survey';
    comp.formGroup.get('selectedKey').setValue('optionKey0');

    comp.onActionButtonClick();
    fixture.detectChanges();

    expect((comp as any).analytics.trackClick).toHaveBeenCalledWith(
      'onboarding-segment--not_an_onboarding_interest_survey--optionKey0'
    );
    expect((comp as any).service.continue).toHaveBeenCalledWith(null);
  });

  it('should continue on skip button click', () => {
    comp.onSkipButtonClick();
    expect((comp as any).service.continue).toHaveBeenCalled();
  });

  it('should select a new option on onOptionContainerClick call and jump carousel', () => {
    comp.onOptionContainerClick('optionKey2', 2);
    expect(comp.formGroup.get('selectedKey').value).toEqual('optionKey2');
    expect(
      (comp as any).featuredCarouselService.jumpToItemIndex$.getValue()
    ).toEqual(2);

    comp.onOptionContainerClick('optionKey1', 1);
    expect(comp.formGroup.get('selectedKey').value).toEqual('optionKey1');
    expect(
      (comp as any).featuredCarouselService.jumpToItemIndex$.getValue()
    ).toEqual(1);
  });
});
