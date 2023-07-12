import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OnboardingV5FooterComponent } from './footer.component';
import { OnboardingV5Service } from '../../services/onboarding-v5.service';
import { BehaviorSubject } from 'rxjs';
import { MockComponent, MockService } from '../../../../utils/mock';
import { By } from '@angular/platform-browser';

describe('OnboardingV5FooterComponent', () => {
  let comp: OnboardingV5FooterComponent;
  let fixture: ComponentFixture<OnboardingV5FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        OnboardingV5FooterComponent,
        MockComponent({
          selector: 'm-button',
          inputs: ['color', 'solid', 'disabled', 'saving'],
          outputs: ['onAction'],
        }),
      ],
      providers: [
        {
          provide: OnboardingV5Service,
          useValue: MockService(OnboardingV5Service, {
            has: ['completionInProgress$'],
            props: {
              completionInProgress$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
            },
          }),
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingV5FooterComponent);
    comp = fixture.componentInstance;

    (comp as any).service.completionInProgress$.next(false);

    fixture.detectChanges();
  });

  it('should initialize', () => {
    expect(comp).toBeTruthy();
  });

  it('should emit actionButtonClick on onActionButtonClick', () => {
    spyOn(comp.actionButtonClick, 'emit');
    comp.onActionButtonClick();
    expect(comp.actionButtonClick.emit).toHaveBeenCalledWith(true);
  });

  it('should emit skipButtonClick on onSkipButtonClick', () => {
    spyOn(comp.skipButtonClick, 'emit');
    comp.onSkipButtonClick();
    expect(comp.skipButtonClick.emit).toHaveBeenCalledWith(true);
  });

  it('should show a skip button when skip button is present and disableActionButton is true', () => {
    (comp as any).skipButton = {
      __typename: 'ComponentOnboardingV5ActionButton',
      dataRef: 'data-ref',
      id: 'id',
      text: 'Skip',
    };
    (comp as any).actionButton = {
      __typename: 'ComponentOnboardingV5ActionButton',
      dataRef: 'data-ref2',
      id: 'id2',
      text: 'Continue',
    };
    (comp as any).disabledActionButton = true;
    fixture.detectChanges();

    expect(
      fixture.debugElement.query(By.css('.m-onboardingV5Footer__skipButton'))
    ).toBeDefined();
  });

  it('should show action button when skip button is present and disableActionButton is false', () => {
    (comp as any).skipButton = {
      __typename: 'ComponentOnboardingV5ActionButton',
      dataRef: 'data-ref',
      id: 'id',
      text: 'Skip',
    };
    (comp as any).actionButton = {
      __typename: 'ComponentOnboardingV5ActionButton',
      dataRef: 'data-ref2',
      id: 'id2',
      text: 'Continue',
    };
    (comp as any).disabledActionButton = false;
    fixture.detectChanges();

    expect(
      fixture.debugElement.query(By.css('.m-onboardingV5Footer__actionButton'))
    ).toBeDefined();
  });

  it('should show a action button when skip button is NOT present', () => {
    (comp as any).skipButton = null;
    (comp as any).actionButton = {
      __typename: 'ComponentOnboardingV5ActionButton',
      dataRef: 'data-ref2',
      id: 'id2',
      text: 'Continue',
    };
    (comp as any).disabledActionButton = true;
    fixture.detectChanges();

    expect(
      fixture.debugElement.query(By.css('.m-onboardingV5Footer__actionButton'))
    ).toBeDefined();
  });
});
