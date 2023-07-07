import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OnboardingV5Component } from './onboarding-v5.component';
import { OnboardingV5Service } from '../services/onboarding-v5.service';
import { Subscription, fromEvent } from 'rxjs';
import { MockService } from '../../../utils/mock';

describe('OnboardingV5Component', () => {
  let comp: OnboardingV5Component;
  let fixture: ComponentFixture<OnboardingV5Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OnboardingV5Component],
      providers: [
        {
          provide: OnboardingV5Service,
          useValue: MockService(OnboardingV5Service),
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
});
