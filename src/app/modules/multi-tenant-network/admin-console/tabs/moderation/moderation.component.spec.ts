import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NetworkAdminConsoleModerationComponent } from './moderation.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Session } from '../../../../../services/session';
import { PermissionsService } from '../../../../../common/services/permissions.service';
import { ConfigsService } from '../../../../../common/services/configs.service';
import { MockComponent, MockService } from '../../../../../utils/mock';

describe('NetworkAdminConsoleModerationComponent', () => {
  let comp: NetworkAdminConsoleModerationComponent;
  let fixture: ComponentFixture<NetworkAdminConsoleModerationComponent>;
  let sessionMock: jasmine.SpyObj<Session>;
  let permissionsServiceMock: jasmine.SpyObj<PermissionsService>;

  beforeEach(() => {
    sessionMock = jasmine.createSpyObj('Session', ['isAdmin']);
    permissionsServiceMock = jasmine.createSpyObj('PermissionsService', [
      'canModerateContent',
    ]);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        NetworkAdminConsoleModerationComponent,
        MockComponent({
          selector: 'm-networkAdminConsole__nsfwToggle',
        }),
      ],
      providers: [
        { provide: Session, useValue: sessionMock },
        { provide: PermissionsService, useValue: permissionsServiceMock },
        { provide: ConfigsService, useValue: MockService(ConfigsService) },
      ],
    });

    fixture = TestBed.createComponent(NetworkAdminConsoleModerationComponent);
    comp = fixture.componentInstance;
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  function testTabVisibility(tabRef: string, expectedVisible: boolean) {
    fixture.detectChanges(); // Trigger change detection
    const tabElement = fixture.debugElement.query(
      By.css(`[data-ref=${tabRef}]`)
    );
    if (expectedVisible) {
      expect(tabElement).toBeTruthy();
    } else {
      expect(tabElement).toBeNull();
    }
  }

  function testNsfwToggleVisibility(expectedVisible: boolean) {
    fixture.detectChanges(); // Trigger change detection
    const nsfwToggleElement = fixture.debugElement.query(
      By.css('m-networkAdminConsole__nsfwToggle')
    );
    if (expectedVisible) {
      expect(nsfwToggleElement).toBeTruthy();
    } else {
      expect(nsfwToggleElement).toBeNull();
    }
  }

  describe('Tab visibility for admin users', () => {
    beforeEach(() => {
      sessionMock.isAdmin.and.returnValue(true); // User is an admin
      permissionsServiceMock.canModerateContent.and.returnValue(false); // Admin does not have moderate content permission
    });

    it('should display admin specific tabs', () => {
      testTabVisibility('network-admin-console-tab-community-guidelines', true); // Admin-specific tabs should be visible
      testTabVisibility('network-admin-console-tab-privacy-policy', true);
      testTabVisibility('network-admin-console-tab-terms-of-service', true);
      testTabVisibility('network-admin-console-tab-reports', false); // Reports tab should not be visible
    });
  });

  describe('Tab visibility for user with canModerateContent permission', () => {
    beforeEach(() => {
      sessionMock.isAdmin.and.returnValue(false); // User is not an admin
      permissionsServiceMock.canModerateContent.and.returnValue(true); // User can moderate content
    });

    it('should display only the report and boost tabs', () => {
      Object.defineProperty(comp, 'isBoostEnabled', {
        writable: true,
        value: true,
      });
      fixture.detectChanges();

      testTabVisibility('network-admin-console-tab-reports', true); // Reports tab should be visible
      testTabVisibility('network-admin-console-tab-boosts', true); // Boosts tab should be visible
      testTabVisibility(
        'network-admin-console-tab-community-guidelines',
        false
      ); // Other tabs should not be visible
      testTabVisibility('network-admin-console-tab-privacy-policy', false);
      testTabVisibility('network-admin-console-tab-terms-of-service', false);
    });

    it('should display the report tab but not the boost tab when boost is not enabled', () => {
      Object.defineProperty(comp, 'isBoostEnabled', {
        writable: true,
        value: false,
      });
      fixture.detectChanges();

      testTabVisibility('network-admin-console-tab-reports', true); // Reports tab should be visible
      testTabVisibility('network-admin-console-tab-boosts', false); // Boosts tab should NOT be visible
      testTabVisibility(
        'network-admin-console-tab-community-guidelines',
        false
      ); // Other tabs should not be visible
      testTabVisibility('network-admin-console-tab-privacy-policy', false);
      testTabVisibility('network-admin-console-tab-terms-of-service', false);
    });

    it('should display only the reports tab', () => {
      testTabVisibility('network-admin-console-tab-reports', true); // Reports tab should be visible
      testTabVisibility(
        'network-admin-console-tab-community-guidelines',
        false
      ); // Other tabs should not be visible
      testTabVisibility('network-admin-console-tab-privacy-policy', false);
      testTabVisibility('network-admin-console-tab-terms-of-service', false);
    });
  });

  describe('NSFW Toggle visibility for admin user', () => {
    beforeEach(() => {
      sessionMock.isAdmin.and.returnValue(true); // User is an admin
    });

    it('should display NSFW Toggle for admin users', () => {
      testNsfwToggleVisibility(true);
    });
  });

  describe('NSFW Toggle visibility for non-admin user', () => {
    beforeEach(() => {
      sessionMock.isAdmin.and.returnValue(false); // User is not an admin
    });

    it('should not display NSFW Toggle for non-admin users', () => {
      testNsfwToggleVisibility(false);
    });
  });
});
