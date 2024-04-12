import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../../common/components/button/button.component';
import { MockService } from '../../../../../utils/mock';
import { MultiFactorAuthService } from '../../services/multi-factor-auth-service';
import { MultiFactorAuthEmailComponent } from './email.component';

describe('MultiFactorAuthEmailComponent', () => {
  let comp: MultiFactorAuthEmailComponent;
  let fixture: ComponentFixture<MultiFactorAuthEmailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [MultiFactorAuthEmailComponent, ButtonComponent],
      providers: [
        {
          provide: MultiFactorAuthService,
          useValue: MockService(MultiFactorAuthService),
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiFactorAuthEmailComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('should call to validate email code on verify click', () => {
    comp.onVerifyClick();

    expect((comp as any).service.completeMultiFactor).toHaveBeenCalled();
  });
});
