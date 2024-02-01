import { TestBed } from '@angular/core/testing';
import { CanModerateContentGuard } from './can-moderate-content.guard';
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { PermissionsService } from '../../../../common/services/permissions.service';

describe('CanModerateContentGuard', () => {
  let guard: CanModerateContentGuard;
  let permissions: jasmine.SpyObj<PermissionsService>;
  let router: jasmine.SpyObj<Router>;
  let routeMock: any;
  let stateMock: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CanModerateContentGuard,
        {
          provide: PermissionsService,
          useValue: jasmine.createSpyObj('PermissionsService', [
            'canModerateContent',
          ]),
        },
        {
          provide: Router,
          useValue: jasmine.createSpyObj('Router', ['navigate']),
        },
      ],
    });

    guard = TestBed.inject(CanModerateContentGuard);
    permissions = TestBed.inject(PermissionsService) as jasmine.SpyObj<
      PermissionsService
    >;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    routeMock = {} as ActivatedRouteSnapshot;
    stateMock = {} as RouterStateSnapshot;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow the moderated content route for users with permission', () => {
    permissions.canModerateContent.and.returnValue(true);
    expect(guard.canActivate(routeMock, stateMock)).toBeTrue();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should redirect to community guidelines for users without permission', () => {
    permissions.canModerateContent.and.returnValue(false);
    guard.canActivate(routeMock, stateMock);
    expect(router.navigate).toHaveBeenCalledWith([
      '/moderation/community-guidelines',
    ]);
  });
});
