import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ChannelsV2Service } from '../channels-v2.service';
import { PostMenuService } from '../../../../common/components/post-menu/post-menu.service';
import { ActivityService } from '../../../../common/services/activity.service';
import { Router } from '@angular/router';
import { Client } from '../../../../services/api/client';
import { ChannelAdminConfirmationService } from './admin-confirmation/admin-confirmation.service';
import { AdminSupersetLinkService } from '../../../../common/services/admin-superset-link.service';
import { ChannelActionsMenuComponent } from './menu.component';
import { MockComponent, MockService } from '../../../../utils/mock';
import { BehaviorSubject } from 'rxjs';
import { IS_TENANT_NETWORK } from '../../../../common/injection-tokens/tenant-injection-tokens';
import { PermissionsService } from '../../../../common/services/permissions.service';
import { PermissionsEnum } from '../../../../../graphql/generated.engine';

describe('ChannelActionsMenuComponent', () => {
  let comp: ChannelActionsMenuComponent;
  let fixture: ComponentFixture<ChannelActionsMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ChannelActionsMenuComponent,
        MockComponent({
          selector: 'm-dropdownMenu',
          inputs: ['anchorPosition', 'menu'],
        }),
      ],
      providers: [
        {
          provide: ChannelsV2Service,
          useValue: MockService(ChannelsV2Service, {
            has: ['channel$'],
            props: {
              channel$: {
                get: () => new BehaviorSubject<any>({ guid: '123' }),
              },
            },
          }),
        },
        { provide: Router, useValue: MockService(Router) },
        { provide: Client, useValue: MockService(Client) },
        {
          provide: ChannelAdminConfirmationService,
          useValue: MockService(ChannelAdminConfirmationService, {
            has: ['completed$'],
            props: {
              completed$: { get: () => new BehaviorSubject<boolean>(false) },
            },
          }),
        },
        {
          provide: AdminSupersetLinkService,
          useValue: MockService(AdminSupersetLinkService),
        },
        {
          provide: PermissionsService,
          useValue: MockService(PermissionsService),
        },
        { provide: IS_TENANT_NETWORK, useValue: true },
      ],
    })
      .overrideProvider(PostMenuService, {
        useValue: MockService(PostMenuService),
      })
      .overrideProvider(ActivityService, {
        useValue: MockService(ActivityService),
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelActionsMenuComponent);
    comp = fixture.componentInstance;

    Object.defineProperty(comp, 'isTenantNetwork', { writable: true });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('should get user superset url from admin superset link service', () => {
    (comp as any).service.channel$.next({ guid: '123' });

    const url: string = 'https://www.minds.com/';
    (comp as any).adminSupersetLink.getUserOverviewUrl.and.returnValue(url);

    expect(comp.getUserSupersetUrl()).toBe(url);
    expect(
      (comp as any).adminSupersetLink.getUserOverviewUrl
    ).toHaveBeenCalledOnceWith('123');
  });

  describe('ban', () => {
    it('should call to ban user', fakeAsync(() => {
      (comp as any).postMenu.setEntity.and.returnValue((comp as any).postMenu);

      comp.ban();
      tick();

      expect((comp as any).service.setChannel).toHaveBeenCalled();
      expect((comp as any).postMenu.setEntity).toHaveBeenCalled();
      expect((comp as any).postMenu.ban).toHaveBeenCalled();
    }));
  });

  describe('shouldShowTenantModerationOptions', () => {
    it('should determine to show tenant moderation options', () => {
      (comp as any).permissions.has
        .withArgs(PermissionsEnum.CanModerateContent)
        .and.returnValue(true);
      (comp as any).isTenantNetwork = true;
      expect(comp.shouldShowTenantModerationOptions()).toBe(true);
    });

    it('should determine NOT to show tenant moderation options because the user has no permission', () => {
      (comp as any).permissions.has
        .withArgs(PermissionsEnum.CanModerateContent)
        .and.returnValue(false);
      (comp as any).isTenantNetwork = true;
      expect(comp.shouldShowTenantModerationOptions()).toBe(false);
    });

    it('should determine NOT to show tenant moderation options because the user is not on a tenant network', () => {
      (comp as any).permissions.has
        .withArgs(PermissionsEnum.CanModerateContent)
        .and.returnValue(true);
      (comp as any).isTenantNetwork = false;
      expect(comp.shouldShowTenantModerationOptions()).toBe(false);
    });
  });
});
