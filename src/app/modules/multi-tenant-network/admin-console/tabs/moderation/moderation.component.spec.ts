import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NetworkAdminConsoleModerationComponent } from './moderation.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Session } from '../../../../../services/session';
import { PermissionsService } from '../../../../../common/services/permissions.service';

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
      declarations: [NetworkAdminConsoleModerationComponent],
      providers: [
        { provide: Session, useValue: sessionMock },
        { provide: PermissionsService, useValue: permissionsServiceMock },
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

  describe('Tab visibility based on permissions', () => {
    it('should display the reports tab only if canModerateContent is true', () => {
      permissionsServiceMock.canModerateContent.and.returnValue(true);
      sessionMock.isAdmin.and.returnValue(true); // Admin but should not matter
      testTabVisibility('network-admin-console-tab-reports', true);

      permissionsServiceMock.canModerateContent.and.returnValue(false);
      testTabVisibility('network-admin-console-tab-reports', false);
    });
  });

  describe('Tab visibility for admin users', () => {
    beforeEach(() => {
      sessionMock.isAdmin.and.returnValue(true); // User is an admin
      permissionsServiceMock.canModerateContent.and.returnValue(false); // Admin but without moderate content permission
    });

    it('should display correct tabs for admin users', () => {
      // List the tabs that should be visible to admin users
      const visibleTabsForAdmin = [
        'community-guidelines',
        'privacy-policy',
        'terms-of-service',
      ];
      visibleTabsForAdmin.forEach(tab =>
        testTabVisibility(`network-admin-console-tab-${tab}`, true)
      );

      // Confirm reports tab is not visible
      testTabVisibility('network-admin-console-tab-reports', false);
    });
  });
});
