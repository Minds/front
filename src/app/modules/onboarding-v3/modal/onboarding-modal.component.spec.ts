import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockService } from '../../../utils/mock';
import { OnboardingV3ModalComponent } from './onboarding-modal.component';
import { OnboardingStepName } from '../onboarding-v3.service';
import { OnboardingV3PanelService } from '../panel/onboarding-panel.service';
import { featuresServiceMock } from '../../../../tests/features-service-mock.spec';
import { BehaviorSubject } from 'rxjs';
import { By } from '@angular/platform-browser';

const currentStep$ = new BehaviorSubject<OnboardingStepName>(
  'SuggestedHashtagsStep'
);

const dismiss$ = new BehaviorSubject<boolean>(null);

const panelServiceMock: any = MockService(OnboardingV3PanelService, {
  has: ['dismiss$', 'currentStep$'],
  props: {
    currentStep$: { get: () => currentStep$ },
    dismiss$: { get: () => dismiss$ },
  },
});

describe('OnboardingV3ModalComponent', () => {
  let comp: OnboardingV3ModalComponent;
  let fixture: ComponentFixture<OnboardingV3ModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OnboardingV3ModalComponent],
      providers: [
        { provide: OnboardingV3PanelService, useValue: panelServiceMock },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    featuresServiceMock.mock('onboarding-october-2020', true);

    fixture = TestBed.createComponent(OnboardingV3ModalComponent);

    comp = fixture.componentInstance;

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
      'url("../../../../assets/photos/confetti-concert-colors.jpg")'
    );
  });

  it('should return CSS for the modals banner src', () => {
    comp.currentStep$.next('SuggestedHashtagsStep');
    let bannerElement: HTMLElement = fixture.debugElement.query(
      By.css('.m-modalV2__header')
    ).nativeElement;
    expect(bannerElement.style['background-image']).toBe(
      'url("../../../../assets/photos/confetti-concert-colors.jpg")'
    );
  });

  it('it should show the banner for suggested hashtags welcome step', () => {
    comp.currentStep$.next('SuggestedHashtagsStep');
    comp.showBanner$.subscribe(val => {
      expect(val).toBe(true);
    });
  });

  it('should call next step in panel service and emit to nextClicked$', () => {
    const sub = comp.nextClicked$.subscribe(val => {
      expect(val).toBe(false);
      sub.unsubscribe();
    });

    comp.nextClicked();

    const sub2 = comp.nextClicked$.subscribe(val => {
      expect(val).toBe(true);
      sub.unsubscribe();
    });

    expect((comp as any).panel.nextStep).toHaveBeenCalled();
  });
});
