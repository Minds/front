import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SettingsV2Component } from './settings-v2.component';
import { ToasterService } from '../../common/services/toaster.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Session } from '../../services/session';
import { sessionMock } from '../../../tests/session-mock.spec';
import { MockComponent, MockService } from '../../utils/mock';
import { Client } from '../../services/api/client';
import { clientMock } from '../../../tests/client-mock.spec';
import { ProService } from '../pro/pro.service';
import { Router } from '@angular/router';
import { LoadingSpinnerComponent } from '../../common/components/loading-spinner/loading-spinner.component';
import { IsTenantService } from '../../common/services/is-tenant.service';
import { PermissionsService } from '../../common/services/permissions.service';
import { PermissionsEnum } from '../../../graphql/generated.engine';

describe('SettingsV2Component', () => {
  let component: SettingsV2Component;
  let fixture: ComponentFixture<SettingsV2Component>;
  let router: Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        MockComponent({
          selector: 'm-nestedMenu',
          inputs: ['isNested', 'menus', 'parentRoute', 'disableActiveClass'],
          outputs: ['itemSelected', 'clickedBack'],
        }),
        SettingsV2Component,
        LoadingSpinnerComponent,
      ],
      providers: [
        { provide: Client, useValue: clientMock },
        { provide: Session, useValue: sessionMock },
        {
          provide: ProService,
          useValue: MockService(ProService, { get: {} }),
        },
        {
          provide: ToasterService,
          useValue: MockService(ToasterService),
        },
        {
          provide: IsTenantService,
          useValue: MockService(IsTenantService),
        },
        {
          provide: PermissionsService,
          useValue: MockService(PermissionsService),
        },
      ],
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: 'settings',
            children: [
              {
                path: 'account',
                data: {
                  isMenu: true,
                },
                component: SettingsV2Component,
                children: [
                  {
                    path: '**',
                    redirectTo: 'account',
                  },
                ],
              },
            ],
          },
        ]),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    router = TestBed.inject(Router);

    clientMock.response = [];
    clientMock.response[`api/v1/settings`] = {
      status: 'success',
      channel: {
        guid: '1000',
        type: 'user',
        subtype: false,
        time_created: '1588335632',
        time_updated: false,
        container_guid: '0',
        owner_guid: '0',
        site_guid: false,
        access_id: '2',
        tags: [],
        nsfw: [],
        nsfw_lock: [],
        allow_comments: false,
        name: 'minds',
        username: 'minds',
        language: 'en',
        icontime: '1588336581',
        legacy_guid: false,
        featured_id: false,
        banned: 'no',
        ban_reason: false,
        website: '',
        briefdescription: '',
        gender: '',
        city: '',
        merchant: false,
        boostProPlus: false,
        fb: false,
        mature: 0,
        monetized: '',
        signup_method: false,
        social_profiles: [],
        feature_flags: false,
        programs: [],
        plus: false,
        hashtags: false,
        verified: false,
        founder: false,
        disabled_boost: false,
        boost_autorotate: true,
        categories: [],
        wire_rewards: null,
        pinned_posts: [],
        is_mature: false,
        mature_lock: false,
        last_accepted_tos: 1535378124,
        opted_in_hashtags: 0,
        last_avatar_upload: '1588336581',
        canary: false,
        theme: false,
        toaster_notifications: true,
        mode: 0,
        btc_address: '',
        surge_token: '',
        hide_share_buttons: false,
        dismissed_widgets: [],
        urn: 'urn:user:10000',
        subscribed: false,
        subscriber: false,
        boost_rating: 1,
        pro: false,
        rewards: false,
        p2p_media_enabled: false,
        is_admin: true,
        onchain_booster: 0,
        spam: 0,
        deleted: 0,
        email_confirmed: true,
        eth_wallet: '',
        rating: 1,
        disable_autoplay_videos: false,
        email: 'minds@minds.com',
        disabled_emails: false,
        open_sessions: 4,
      },
    };

    fixture = TestBed.createComponent(SettingsV2Component);

    component = fixture.componentInstance;

    router.navigateByUrl('/settings/account');
    fixture.detectChanges();
    fixture.detectChanges();
  });

  it("should have an 'Account Upgrade' submenu which is only visible if you're neither pro nor plus", () => {
    const accountMenu: any = component.secondaryMenus.account[2];
    expect(accountMenu.header.label).toEqual('Account Upgrade');

    sessionMock.user.pro = false;
    sessionMock.user.plus = false;

    fixture.detectChanges();

    expect(accountMenu.shouldShow()).toBeTruthy();

    sessionMock.user.pro = true;
    sessionMock.user.plus = true;

    fixture.detectChanges();

    expect(accountMenu.shouldShow()).toBeFalsy();
  });

  it("should have a 'Upgrade to Pro' option which is only visible if you're not pro", () => {
    const menuItem: any = component.secondaryMenus.account[2].items[0];

    expect(menuItem.label).toEqual('Upgrade to Pro');

    sessionMock.user.pro = false;
    fixture.detectChanges();

    expect(menuItem.shouldShow()).toBeTruthy();

    sessionMock.user.pro = true;
    fixture.detectChanges();

    expect(menuItem.shouldShow()).toBeFalsy();
  });

  it("should have a 'Upgrade to Plus' option which is only visible if you're not pro", () => {
    const menuItem: any = component.secondaryMenus.account[2].items[1];

    expect(menuItem.label).toEqual('Upgrade to Plus');

    sessionMock.user.plus = false;
    fixture.detectChanges();

    expect(menuItem.shouldShow()).toBeTruthy();

    sessionMock.user.plus = true;
    fixture.detectChanges();

    expect(menuItem.shouldShow()).toBeFalsy();
  });

  it('should determine if the user has permission to use RSS sync', () => {
    (component as any).permissionsService.has
      .withArgs(PermissionsEnum.CanUseRssSync)
      .and.returnValue(true);

    expect((component as any).hasRssSyncPermission()).toBe(true);
  });

  it('should determine if the user does NOT have permission to use RSS sync', () => {
    (component as any).permissionsService.has
      .withArgs(PermissionsEnum.CanUseRssSync)
      .and.returnValue(false);

    expect((component as any).hasRssSyncPermission()).toBe(false);
  });

  describe('shouldShowContentMigrationHeader', () => {
    it('should determine if content migration header should be shown because RSS sync option should be shown', () => {
      (component as any).permissionsService.has
        .withArgs(PermissionsEnum.CanUseRssSync)
        .and.returnValue(true);

      (component as any).IsTenantService.is.and.returnValue(true);

      expect((component as any).shouldShowContentMigrationHeader()).toBe(true);
    });

    it('should determine if content migration header should be shown because it is not a tenant network', () => {
      (component as any).permissionsService.has
        .withArgs(PermissionsEnum.CanUseRssSync)
        .and.returnValue(false);

      (component as any).IsTenantService.is.and.returnValue(false);

      expect((component as any).shouldShowContentMigrationHeader()).toBe(true);
    });

    it('should determine if content migration header should NOT be shown', () => {
      (component as any).permissionsService.has
        .withArgs(PermissionsEnum.CanUseRssSync)
        .and.returnValue(false);

      (component as any).IsTenantService.is.and.returnValue(true);

      expect((component as any).shouldShowContentMigrationHeader()).toBe(false);
    });
  });
});
