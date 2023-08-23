import { TestBed } from '@angular/core/testing';
import { loggedOutExplainerScreenGuard } from './logged-out-explainer-screen.guard';
import { Router, RouterStateSnapshot } from '@angular/router';
import { Session } from '../../../services/session';
import { ExplainerScreensService } from '../services/explainer-screen.service';

const sessionMock: jasmine.SpyObj<Session> = jasmine.createSpyObj<Session>([
  'isLoggedIn',
]);

const explainerScreenMock: jasmine.SpyObj<ExplainerScreensService> = jasmine.createSpyObj<
  ExplainerScreensService
>(['handleRouteChange']);

const routerMock: jasmine.SpyObj<Router> = jasmine.createSpyObj<Router>([
  'getCurrentNavigation',
  'navigate',
]);

describe('loggedOutExplainerScreenGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Session, useValue: sessionMock },
        { provide: ExplainerScreensService, useValue: explainerScreenMock },
        { provide: Router, useValue: routerMock },
      ],
    });
  });

  afterEach(() => {
    sessionMock.isLoggedIn.calls.reset();
    explainerScreenMock.handleRouteChange.calls.reset();
    routerMock.getCurrentNavigation.calls.reset();
    routerMock.navigate.calls.reset();
  });

  describe('Not logged in', () => {
    it('should return false and check the explainer screen service for matching routes', () => {
      const url: string = '/test-trigger-path';
      sessionMock.isLoggedIn.and.returnValue(false);
      routerMock.getCurrentNavigation.and.returnValue({
        previousNavigation: {
          finalUrl: '/',
        },
      } as any);

      const result = TestBed.runInInjectionContext(() =>
        loggedOutExplainerScreenGuard()(null, {
          url: url,
        } as RouterStateSnapshot)
      );

      expect(routerMock.getCurrentNavigation).toHaveBeenCalledTimes(1);
      expect(routerMock.navigate).not.toHaveBeenCalledOnceWith(['/login']);
      expect(explainerScreenMock.handleRouteChange).toHaveBeenCalledOnceWith(
        url
      );
      expect(result).toEqual(false);
    });

    it('should return false, check the explainer screen service for matching routes and pass to login screen when there are no previously navigated routes', () => {
      const url: string = '/test-trigger-path';
      sessionMock.isLoggedIn.and.returnValue(false);
      routerMock.getCurrentNavigation.and.returnValue({
        previousNavigation: null,
      } as any);

      const result = TestBed.runInInjectionContext(() =>
        loggedOutExplainerScreenGuard()(null, {
          url: url,
        } as RouterStateSnapshot)
      );

      expect(routerMock.getCurrentNavigation).toHaveBeenCalledTimes(1);
      expect(routerMock.navigate).toHaveBeenCalledOnceWith(['/login']);
      expect(explainerScreenMock.handleRouteChange).toHaveBeenCalledOnceWith(
        url
      );
      expect(result).toEqual(false);
    });
  });

  describe('Logged in', () => {
    it('should return true and NOT check the explainer screen service for matching routes', () => {
      const url: string = '/test-trigger-path';
      sessionMock.isLoggedIn.and.returnValue(true);

      const result = TestBed.runInInjectionContext(() =>
        loggedOutExplainerScreenGuard()(null, {
          url: url,
        } as RouterStateSnapshot)
      );

      expect(
        explainerScreenMock.handleRouteChange
      ).not.toHaveBeenCalledOnceWith(url);
      expect(result).toEqual(true);
    });
  });
});
