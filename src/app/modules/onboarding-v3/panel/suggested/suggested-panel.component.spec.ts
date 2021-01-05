import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { MockService } from '../../../../utils/mock';
import { OnboardingV3SuggestionsPanelComponent } from './suggested-panel.component';
import { OnboardingV3SuggestionsPanelService } from './suggested-panel.service';

describe('OnboardingV3SuggestionsPanelComponent', () => {
  let comp: OnboardingV3SuggestionsPanelComponent;
  let fixture: ComponentFixture<OnboardingV3SuggestionsPanelComponent>;

  const suggestions$ = of([]);

  const serviceMock: any = MockService(OnboardingV3SuggestionsPanelService, {
    has: ['suggestions$'],
    props: {
      suggestions$: { get: () => suggestions$ },
    },
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OnboardingV3SuggestionsPanelComponent],
      providers: [
        {
          provide: OnboardingV3SuggestionsPanelService,
          useValue: serviceMock,
        },
      ],
      imports: [],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingV3SuggestionsPanelComponent);

    comp = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  it('should call to load on init', () => {
    expect((comp as any).service.load).toHaveBeenCalled();
  });
});
