import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { ForgotPasswordComponent } from './forgot-password.component';
import { ReactiveFormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  Params,
  Router,
  convertToParamMap,
} from '@angular/router';
import { MockService } from '../../../utils/mock';
import { BehaviorSubject } from 'rxjs';

describe('ForgotPasswordComponent', () => {
  let comp: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ForgotPasswordComponent],
      imports: [ReactiveFormsModule],
      providers: [
        {
          provide: Router,
          useValue: MockService(Router),
        },
        {
          provide: ActivatedRoute,
          useValue: {
            params: new BehaviorSubject<Params>(
              convertToParamMap({
                username: '',
                code: '',
              })
            ),
          },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should init', () => {
    expect(comp).toBeDefined();
  });

  it('should navigate to root page on init with correct params for request', fakeAsync(() => {
    (comp as any).router.navigate.calls.reset();

    (comp as any).route.params.next({
      username: '',
      code: '',
    });
    tick();

    expect((comp as any).router.navigate).toHaveBeenCalledWith(['/'], {
      queryParams: { resetPassword: true },
    });
  }));

  it('should navigate to root page on init with correct params for password change', fakeAsync(() => {
    (comp as any).router.navigate.calls.reset();

    (comp as any).route.params.next({
      username: 'username',
      code: 'code',
    });
    tick();

    expect((comp as any).router.navigate).toHaveBeenCalledWith(['/'], {
      queryParams: { resetPassword: true, username: 'username', code: 'code' },
    });
  }));
});
