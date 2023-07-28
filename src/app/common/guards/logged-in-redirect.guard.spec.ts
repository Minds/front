import { TestBed } from '@angular/core/testing';
import { LoggedInRedirectGuard } from './logged-in-redirect.guard';
import { Router } from '@angular/router';
import { Session } from '../../services/session';
import { LoginReferrerService } from '../../services/login-referrer.service';
import { Location } from '@angular/common';
import { ToasterService } from '../services/toaster.service';
import { MockService } from '../../utils/mock';

describe('LoggedInRedirectGuard', () => {
  let guard: LoggedInRedirectGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LoggedInRedirectGuard,
        { provide: Router, useValue: MockService(Router) },
        { provide: Session, useValue: MockService(Session) },
        {
          provide: LoginReferrerService,
          useValue: MockService(LoginReferrerService),
        },
        { provide: Location, useValue: MockService(Location) },
        { provide: ToasterService, useValue: MockService(ToasterService) },
      ],
    });

    guard = TestBed.inject(LoggedInRedirectGuard);
  });

  it('should init', () => {
    expect(guard).toBeTruthy();
  });

  it('can activate when logged in', () => {
    (guard as any).session.isLoggedIn.and.returnValue(true);

    expect(guard.canActivate()).toBeTruthy();

    expect((guard as any).toast.warn).not.toHaveBeenCalled();
    expect((guard as any).loginReferrer.register).not.toHaveBeenCalled();
    expect((guard as any).router.navigate).not.toHaveBeenCalled();
  });

  it('cannot activate when not logged in', () => {
    (guard as any).session.isLoggedIn.and.returnValue(false);

    expect(guard.canActivate()).toBeFalsy();

    expect((guard as any).toast.warn).toHaveBeenCalled();
    expect((guard as any).loginReferrer.register).toHaveBeenCalled();
    expect((guard as any).router.navigate).toHaveBeenCalled();
  });
});
