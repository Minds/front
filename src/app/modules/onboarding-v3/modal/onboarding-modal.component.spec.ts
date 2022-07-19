import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MockComponent, MockService } from '../../../utils/mock';
import { OnboardingV3ModalComponent } from './onboarding-modal.component';
import { OnboardingStepName } from '../onboarding-v3.service';
import { OnboardingV3PanelService } from '../panel/onboarding-panel.service';
import { ConfigsService } from '../../../common/services/configs.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { By } from '@angular/platform-browser';
import { ButtonComponent } from '../../../common/components/button/button.component';

const currentStep$ = new BehaviorSubject<OnboardingStepName>(
  'SuggestedHashtagsStep'
);

const dismiss$ = new BehaviorSubject<boolean>(false);
const forceComplete$ = new BehaviorSubject<boolean>(false);

const panelServiceMock: any = MockService(OnboardingV3PanelService, {
  has: ['dismiss$', 'currentStep$', 'forceComplete$'],
  props: {
    currentStep$: { get: () => currentStep$ },
    dismiss$: { get: () => dismiss$ },
    forceComplete$: { get: () => forceComplete$ },
  },
});

describe('OnboardingV3ModalComponent', () => {
  let comp: OnboardingV3ModalComponent;
  let fixture: ComponentFixture<OnboardingV3ModalComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          OnboardingV3ModalComponent,
          MockComponent({
            selector: 'm-onboardingV3__tags',
          }),
          ButtonComponent,
        ],
        providers: [
          { provide: OnboardingV3PanelService, useValue: panelServiceMock },
          { provide: ConfigsService, useValue: MockService(ConfigsService) },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingV3ModalComponent);

    comp = fixture.componentInstance;
    (comp as any).dismiss$ = new Subscription();
    (comp as any).forceComplete$ = new Subscription();

    fixture.detectChanges();
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  it('should return CSS for the modals banner src', () => {
    comp.currentStep$.next('SuggestedHashtagsStep');
    const bannerElement: HTMLElement = fixture.debugElement.query(
      By.css('.m-modalV2__header')
    ).nativeElement;
    expect(bannerElement.style['background-image']).toBe(
      'url("nullassets/photos/confetti-concert-colors.jpg")'
    );
  });

  it('it should show the banner for suggested hashtags welcome step', () => {
    comp.currentStep$.next('SuggestedHashtagsStep');
    comp.showBanner$.subscribe(val => {
      expect(val).toBe(true);
    });
  });

  it('should call next step in panel service', () => {
    comp.nextClicked();
    expect((comp as any).panel.nextStep).toHaveBeenCalled();
  });
});
