import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NetworkAdminConsoleTabsComponent } from './tabs.component';
import { By } from '@angular/platform-browser';
import { Session } from '../../../../services/session';
import { PermissionsService } from '../../../../common/services/permissions.service';

describe('NetworkAdminConsoleTabsComponent', () => {
  let comp: NetworkAdminConsoleTabsComponent;
  let fixture: ComponentFixture<NetworkAdminConsoleTabsComponent>;
  let sessionMock: jasmine.SpyObj<Session>;
  let permissionsServiceMock: jasmine.SpyObj<PermissionsService>;

  beforeEach(() => {
    sessionMock = jasmine.createSpyObj('Session', ['isAdmin']);
    permissionsServiceMock = jasmine.createSpyObj('PermissionsService', [
      'canModerateContent',
    ]);

    TestBed.configureTestingModule({
      declarations: [NetworkAdminConsoleTabsComponent],
      providers: [
        { provide: Session, useValue: sessionMock },
        { provide: PermissionsService, useValue: permissionsServiceMock },
      ],
    });

    fixture = TestBed.createComponent(NetworkAdminConsoleTabsComponent);
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

  describe('Tab visibility for admin user', () => {
    beforeEach(() => {
      sessionMock.isAdmin.and.returnValue(true);
      permissionsServiceMock.canModerateContent.and.returnValue(false);
    });

    it('should display all tabs for admin', () => {
      const tabs = [
        'general',
        'domain',
        'invite',
        'appearance',
        'roles',
        'moderation',
      ];
      tabs.forEach(tab =>
        testTabVisibility(`network-admin-console-tab-${tab}`, true)
      );
    });
  });

  describe('Tab visibility for user with canModerateContent permission', () => {
    beforeEach(() => {
      sessionMock.isAdmin.and.returnValue(false);
      permissionsServiceMock.canModerateContent.and.returnValue(true);
    });

    it('should display only the moderation tab', () => {
      const tabs = ['general', 'domain', 'invite', 'appearance', 'roles'];
      tabs.forEach(tab =>
        testTabVisibility(`network-admin-console-tab-${tab}`, false)
      );
      testTabVisibility('network-admin-console-tab-moderation', true);
    });
  });
});
