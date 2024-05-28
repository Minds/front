import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { UserMenuComponent } from './user-menu.component';
import { Session } from '../../../../services/session';
import { ThemeService } from '../../../services/theme.service';
import { MockComponent, MockService } from '../../../../utils/mock';
import { ChangeDetectorRef } from '@angular/core';
import { HelpdeskRedirectService } from '../../../services/helpdesk-redirect.service';
import { BoostModalV2LazyService } from '../../../../modules/boost/modal-v2/boost-modal-v2-lazy.service';
import { BehaviorSubject } from 'rxjs';
import userMock from '../../../../mocks/responses/user.mock';
import { MindsUser } from '../../../../interfaces/entities';
import { PermissionsService } from '../../../services/permissions.service';

describe('UserMenuComponent', () => {
  let comp: UserMenuComponent;
  let fixture: ComponentFixture<UserMenuComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        MockComponent({
          selector: 'minds-avatar',
          inputs: ['object', 'src', 'editMode', 'waitForDoneSignal'],
        }),
        MockComponent({
          selector: 'm-dropdownMenu',
          inputs: ['menu', 'anchorPosition'],
        }),
        MockComponent({
          selector: 'm-dropdownMenu__item',
          inputs: ['link', 'externalLink'],
        }),
        UserMenuComponent,
      ],
      providers: [
        { provide: Session, useValue: MockService(Session) },
        {
          provide: ChangeDetectorRef,
          useValue: MockService(ChangeDetectorRef),
        },
        {
          provide: ThemeService,
          useValue: MockService(ThemeService, {
            has: ['isDark$'],
            props: {
              isDark$: { get: () => new BehaviorSubject<boolean>(true) },
            },
          }),
        },
        {
          provide: HelpdeskRedirectService,
          useValue: MockService(HelpdeskRedirectService),
        },
        {
          provide: BoostModalV2LazyService,
          useValue: MockService(BoostModalV2LazyService),
        },
        {
          provide: PermissionsService,
          useValue: MockService(PermissionsService),
        },
      ],
    }).compileComponents(); // compile template and css
  }));

  beforeEach(() => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();

    fixture = TestBed.createComponent(UserMenuComponent);
    comp = fixture.componentInstance;

    fixture.detectChanges();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  it('should open boost channel modal', fakeAsync(() => {
    const loggedInUser: MindsUser = userMock;

    (comp as any).session.getLoggedInUser.and.returnValue(loggedInUser);

    comp.openBoostChannelModal();
    tick();

    expect((comp as any).boostModalLazyService.open).toHaveBeenCalledWith(
      loggedInUser
    );
  }));

  describe('hasBoostPermission', () => {
    it('should be true if user has permission to boost', () => {
      (comp as any).permissionsService.canBoost.and.returnValue(true);

      comp.ngOnInit();

      expect((comp as any).hasBoostPermission).toBeTrue();
    });

    it('should be false if user does NOT have permission to boost', () => {
      (comp as any).permissionsService.canBoost.and.returnValue(false);

      comp.ngOnInit();

      expect((comp as any).hasBoostPermission).toBeFalse();
    });
  });
});
