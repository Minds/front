import { TestBed } from '@angular/core/testing';
import { loggedOutExplainerScreenGuard } from './logged-out-explainer-screen.guard';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Session } from '../../../services/session';
import { ExplainerScreensService } from '../services/explainer-screen.service';

const sessionMock: jasmine.SpyObj<Session> = jasmine.createSpyObj<Session>([
  'isLoggedIn',
]);

const explainerScreenMock: jasmine.SpyObj<ExplainerScreensService> = jasmine.createSpyObj<
  ExplainerScreensService
>(['handleRouteChange']);

describe('loggedOutExplainerScreenGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Session, useValue: sessionMock },
        { provide: ExplainerScreensService, useValue: explainerScreenMock },
      ],
    });
  });

  afterEach(() => {
    sessionMock.isLoggedIn.calls.reset();
    explainerScreenMock.handleRouteChange.calls.reset();
  });

  it('should return false and check the explainer screen service for matching routes when a user is logged out', () => {
    const url: string = '/test-trigger-path';
    sessionMock.isLoggedIn.and.returnValue(false);

    const result = TestBed.runInInjectionContext(() =>
      loggedOutExplainerScreenGuard()(null, { url: url } as RouterStateSnapshot)
    );

    expect(explainerScreenMock.handleRouteChange).toHaveBeenCalledOnceWith(url);
    expect(result).toEqual(false);
  });

  it('should return true and NOT check the explainer screen service for matching routes when a user is logged in', () => {
    const url: string = '/test-trigger-path';
    sessionMock.isLoggedIn.and.returnValue(true);

    const result = TestBed.runInInjectionContext(() =>
      loggedOutExplainerScreenGuard()(null, { url: url } as RouterStateSnapshot)
    );

    expect(explainerScreenMock.handleRouteChange).not.toHaveBeenCalledOnceWith(
      url
    );
    expect(result).toEqual(true);
  });
});
