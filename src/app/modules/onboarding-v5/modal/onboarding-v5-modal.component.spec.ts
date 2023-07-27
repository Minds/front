import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OnboardingV5ModalComponent } from './onboarding-v5-modal.component';
import { OnboardingV5Service } from '../services/onboarding-v5.service';
import { Subject } from 'rxjs';
import { MockComponent, MockService } from '../../../utils/mock';

describe('OnboardingV5ModalComponent', () => {
  let comp: OnboardingV5ModalComponent;
  let fixture: ComponentFixture<OnboardingV5ModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        OnboardingV5ModalComponent,
        MockComponent({ selector: 'm-onboardingV5' }),
      ],
      providers: [
        {
          provide: OnboardingV5Service,
          useValue: MockService(OnboardingV5Service, {
            has: ['dismiss$'],
            props: {
              dismiss$: { get: () => new Subject<boolean>() },
            },
          }),
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingV5ModalComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('should call onDismissIntent when dismiss subject emits from service', () => {
    const mockOnDismissIntent = jasmine.createSpy('onDismissIntent');

    comp.setModalData({ onDismissIntent: mockOnDismissIntent });
    comp.ngOnInit();

    (comp as any).service.dismiss$.next(true);

    expect(mockOnDismissIntent).toHaveBeenCalled();
  });

  it('should return modal options with fixed canDismiss as false', async () => {
    const modalOptions = comp.getModalOptions();

    expect(modalOptions.canDismiss).toBeDefined();
    expect(await modalOptions.canDismiss()).toBe(false);
  });

  it('should set onDismissIntent via setModalData', () => {
    const mockOnDismissIntent = jasmine.createSpy('onDismissIntent');
    comp.setModalData({ onDismissIntent: mockOnDismissIntent });
    expect((comp as any).onDismissIntent).toBe(mockOnDismissIntent);
  });
});
