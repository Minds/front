import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NetworkAdminConsoleTabsComponent } from './tabs.component';
import { By } from '@angular/platform-browser';
import { Session } from '../../../../services/session';
import { PermissionsService } from '../../../../common/services/permissions.service';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';

describe('NetworkAdminConsoleTabsComponent', () => {
  let comp: NetworkAdminConsoleTabsComponent;
  let fixture: ComponentFixture<NetworkAdminConsoleTabsComponent>;
  let sessionMock: jasmine.SpyObj<Session>;
  let permissionsServiceMock: jasmine.SpyObj<PermissionsService>;

  beforeEach(() => {
    sessionMock = jasmine.createSpyObj('Session', ['isAdmin']);
    sessionMock.isAdmin.and.returnValue(true);

    permissionsServiceMock = jasmine.createSpyObj('PermissionsService', [
      'canModerateContent',
    ]);

    TestBed.configureTestingModule({
      imports: [CommonModule, RouterTestingModule],
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

    it('should display tabs for admin without canModerateContent permission', () => {
      const tabsToShow = [
        'general',
        'domain',
        'invite',
        'customize',
        'roles',
        'monetization',
        'moderation',
        'monetization',
        'mobile',
      ];
      tabsToShow.forEach((tab) =>
        testTabVisibility(`network-admin-console-tab-${tab}`, true)
      );
    });
  });

  describe('Tab visibility for non-admin user with canModerateContent permission', () => {
    it('should have a monetization tab', () => {
      expect(
        fixture.debugElement.query(
          By.css('[data-ref=network-admin-console-tab-monetization]')
        )
      );
    });

    it('should have a mobile tab', () => {
      sessionMock.isAdmin.and.returnValue(true);
      fixture.detectChanges();

      expect(
        fixture.debugElement.query(
          By.css('[data-ref=network-admin-console-tab-mobile]')
        )
      ).toBeTruthy();
    });
  });

  describe('Tab visibility for user with canModerateContent permission', () => {
    beforeEach(() => {
      Object.defineProperty(comp, 'isAdmin', { writable: true });
      permissionsServiceMock.canModerateContent.and.returnValue(true);
    });

    it('should have a moderation tab', () => {
      (comp as any).isAdmin = true;
      fixture.detectChanges();

      expect(
        fixture.debugElement.query(
          By.css('[data-ref=network-admin-console-tab-moderation]')
        )
      ).toBeTruthy();
    });

    it('should display only the moderation tab', () => {
      (comp as any).isAdmin = false;

      const tabsToNotShow = [
        'general',
        'domain',
        'invite',
        'customize',
        'roles',
        'monetization',
        'mobile',
      ];
      fixture.detectChanges();

      tabsToNotShow.forEach((tab) =>
        testTabVisibility(`network-admin-console-tab-${tab}`, false)
      );
      testTabVisibility('network-admin-console-tab-moderation', true);
    });
  });
});
