import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { ChannelBadgesComponent } from './badges.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Client } from '../../../services/api/client';
import { By } from '@angular/platform-browser';
import { Session } from '../../../services/session';
import { clientMock } from '../../../../tests/client-mock.spec';
import { sessionMock } from '../../../../tests/session-mock.spec';
import { TooltipComponentMock } from '../../../mocks/common/components/tooltip/tooltip.component';
import { ThemeService } from '../../services/theme.service';
import { themeServiceMock } from '../../../mocks/common/services/theme.service-mock.spec';

describe('ChannelBadgesComponent', () => {
  let comp: ChannelBadgesComponent;
  let fixture: ComponentFixture<ChannelBadgesComponent>;
  let session: Session;

  function getCurrentBadge(): DebugElement {
    return fixture.debugElement.query(By.css('.m-channel--badges li'));
  }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TooltipComponentMock, ChannelBadgesComponent],
      imports: [RouterTestingModule, ReactiveFormsModule],
      providers: [
        { provide: Session, useValue: sessionMock },
        { provide: Client, useValue: clientMock },
        { provide: ThemeService, useValue: themeServiceMock },
      ],
    }).compileComponents();
  }));

  beforeEach((done) => {
    fixture = TestBed.createComponent(ChannelBadgesComponent);

    comp = fixture.componentInstance;

    comp.user = sessionMock.user;

    session = comp.session;

    clientMock.response = {};
    fixture.detectChanges();

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        done();
      });
    }
  });

  it('should show plus badge only if the user is plus', () => {
    sessionMock.user.plus = false;
    sessionMock.user.pro = false;
    comp.user = sessionMock.user;
    comp.badges = ['plus'];
    fixture.detectChanges();

    let badge = getCurrentBadge();
    expect(badge).toBeNull();

    sessionMock.user.plus = true;
    comp.user = sessionMock.user;
    fixture.detectChanges();

    badge = getCurrentBadge();

    expect(badge).not.toBeNull();
    expect(badge.nativeElement.textContent).toContain('Minds+');
  });

  it('should show admin badge only if the user is an admin', () => {
    sessionMock.user.is_admin = false;
    comp.user = sessionMock.user;
    comp.badges = ['admin'];
    fixture.detectChanges();

    let badge = getCurrentBadge();
    expect(badge).toBeNull();

    sessionMock.user.is_admin = true;
    comp.user = sessionMock.user;

    fixture.detectChanges();

    badge = getCurrentBadge();

    expect(badge).not.toBeNull();
    expect(badge.nativeElement.textContent).toContain('Admin');
  });

  it('should show the founder badge only if the user is a founder', () => {
    sessionMock.user.admin = false;
    sessionMock.user.founder = false;

    comp.user = sessionMock.user;
    comp.badges = ['founder'];
    fixture.detectChanges();

    let badge = getCurrentBadge();
    expect(badge).toBeNull();

    sessionMock.user.founder = true;
    comp.user = sessionMock.user;

    fixture.detectChanges();

    badge = getCurrentBadge();

    expect(badge).not.toBeNull();
    expect(badge.nativeElement.textContent).toContain('Founder');
  });

  it('should show the founder badge for admins and also let them modify the status', fakeAsync(() => {
    sessionMock.user.admin = false;
    sessionMock.user.founder = false;

    comp.user = sessionMock.user;
    comp.badges = ['founder'];
    fixture.detectChanges();

    let badge = getCurrentBadge();
    expect(badge).toBeNull();

    sessionMock.user.founder = true;
    comp.user = sessionMock.user;

    fixture.detectChanges();

    badge = getCurrentBadge();

    expect(badge).not.toBeNull();
    expect(badge.nativeElement.textContent).toContain('Founder');

    sessionMock.user.admin = true;
    comp.user = sessionMock.user;

    fixture.detectChanges();

    badge = getCurrentBadge();

    expect(badge).not.toBeNull();
    expect(badge.nativeElement.textContent).toContain('Founder');

    clientMock.response['api/v1/admin/founder/1000'] = { status: 'success' };

    badge.nativeElement.click();

    tick();
    fixture.detectChanges();

    expect(clientMock.delete).toHaveBeenCalled();
  }));

  it('should show the verified badge only if the user is verified and not an admin, or if the logged in user is an admin', fakeAsync(() => {
    sessionMock.user.admin = false;
    sessionMock.user.is_admin = false;
    sessionMock.user.verified = false;

    comp.user = { ...sessionMock.user, guid: '2000' };
    comp.badges = ['verified'];
    fixture.detectChanges();

    let badge = getCurrentBadge();
    expect(badge).toBeNull();

    // should appear because the user is verified and not an admin
    sessionMock.user.verified = true;
    comp.user = sessionMock.user;

    fixture.detectChanges();

    badge = getCurrentBadge();

    expect(badge).not.toBeNull();
    expect(badge.nativeElement.textContent).toContain('Verified');

    // should appear because the user is not an admin and the logged in one is
    sessionMock.user.admin = true;
    comp.user = { ...sessionMock.user, guid: '2000' };

    fixture.detectChanges();

    badge = getCurrentBadge();

    expect(badge).not.toBeNull();
    expect(badge.nativeElement.textContent).toContain('Verified');

    // should not appear because the user is an admin
    sessionMock.user.is_admin = true;
    comp.user = { ...sessionMock.user, guid: '2000' };

    fixture.detectChanges();

    badge = getCurrentBadge();

    expect(badge).toBeNull();
  }));
});
