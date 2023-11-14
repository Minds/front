import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { LogoutComponent } from './logout.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { RegisterForm } from '../forms/register/register';
import { MockService } from '../../utils/mock';
import { AuthService } from '../../services/auth.service';
import { BehaviorSubject } from 'rxjs';

describe('LogoutComponent', () => {
  let comp: LogoutComponent;
  let fixture: ComponentFixture<LogoutComponent>;
  const logoutUrlSegments: UrlSegment[] = [
    {
      path: 'logout',
      parameterMap: null,
      parameters: null,
    },
  ];
  const urlSegments: BehaviorSubject<UrlSegment[]> = new BehaviorSubject<
    UrlSegment[]
  >(logoutUrlSegments);

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [LogoutComponent, RegisterForm],
        imports: [RouterTestingModule, ReactiveFormsModule],
        providers: [
          { provide: Router, useValue: MockService(Router) },
          {
            provide: ActivatedRoute,
            useValue: MockService(ActivatedRoute, {
              has: ['snapshot'],
              props: {
                snapshot: {
                  get: () => {
                    return {
                      url: urlSegments.getValue(),
                    };
                  },
                },
              },
            }),
          },
          { provide: AuthService, useValue: MockService(AuthService) },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    urlSegments.next(logoutUrlSegments);

    fixture = TestBed.createComponent(LogoutComponent);

    comp = fixture.componentInstance;

    (comp as any).router.navigate.calls.reset();
    (comp as any).auth.logout.calls.reset();
    (comp as any).auth.logout.and.returnValue(Promise.resolve(true));

    fixture.detectChanges();
  });

  it('should init', fakeAsync(() => {
    expect(comp).toBeTruthy();
  }));

  it('should logout on init without all parameter', fakeAsync(() => {
    (comp as any).router.navigate.calls.reset();
    (comp as any).auth.logout.calls.reset();

    comp.ngOnInit();

    tick();
    expect((comp as any).auth.logout).toHaveBeenCalledWith(false);
    tick();
    expect((comp as any).router.navigate).toHaveBeenCalledWith(['/login']);
  }));
});
