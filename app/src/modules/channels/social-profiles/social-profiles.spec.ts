///<reference path="../../../../../node_modules/@types/jasmine/index.d.ts"/>
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { Client } from '../../../services/api/client';
import { By } from '@angular/platform-browser';
import { clientMock } from '../../../../tests/client-mock.spec';
import { AbbrPipe } from '../../../common/pipes/abbr';
import { MaterialMock } from '../../../../tests/material-mock.spec';
import { FormsModule } from '@angular/forms';
import { MaterialSwitchMock } from '../../../../tests/material-switch-mock.spec';
import { ChannelSocialProfiles } from './social-profiles';

describe('ChannelSocialProfiles', () => {

  let comp: ChannelSocialProfiles;
  let fixture: ComponentFixture<ChannelSocialProfiles>;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [MaterialMock, MaterialSwitchMock, AbbrPipe, ChannelSocialProfiles], // declare the test component
      imports: [FormsModule],
      providers: [
        { provide: Client, useValue: clientMock },
      ]
    })
      .compileComponents();  // compile template and css
  }));

  // synchronous beforeEach
  beforeEach((done) => {

    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();
    fixture = TestBed.createComponent(ChannelSocialProfiles);
    clientMock.response = {};

    comp = fixture.componentInstance;

    fixture.detectChanges();

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        done();
      });
    }
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('not be editing by default', () => {
    const view = fixture.debugElement.query(By.css('.m-channel-social-profiles'));
    const editing = fixture.debugElement.query(By.css('.m-channel-social-profiles-editor'));
    expect(view).not.toBeNull();
    expect(editing).toBeNull();
  });

  it('show editing area when in editing mode', () => {
    comp.editing = true;
    fixture.detectChanges();

    const view = fixture.debugElement.query(By.css('.m-channel-social-profiles'));
    const editing = fixture.debugElement.query(By.css('.m-channel-social-profiles-editor'));
    expect(view.nativeElement.hidden).toBe(true);
    expect(editing).not.toBeNull();
  });

  it('should not have any social fields by default', () => {
    comp.editing = true;
    fixture.detectChanges();

    const field = fixture.debugElement.query(By.css('.m-channel-social-profile-input'));

    expect(comp.socialProfiles.length).toBe(0);
    expect(field).not.toBeNull();
  });

  it('should add a new field on clicking more', fakeAsync(() => {
    comp.editing = true;
    fixture.detectChanges();

    const btn = fixture.debugElement.query(By.css('.m-social-profile-add'));
    btn.nativeElement.click();
    tick();

    expect(comp.socialProfiles.length).toBe(1);
    const field = fixture.debugElement.query(By.css('.m-channel-social-profile-input'));
    expect(field).not.toBeNull();

  }));

  it('should allow me to add a new social field', fakeAsync(() => {
    comp.editing = true;
    comp.newEmptySocialProfile();
    fixture.detectChanges();

    const inputField = fixture.debugElement.query(By.css('.m-channel-social-profile-input input'));
    inputField.nativeElement.value = 'minds.com/mark';
    inputField.nativeElement.dispatchEvent(new Event('input'));

    comp.editing = false;
    tick();
    fixture.detectChanges();

    expect(comp.socialProfiles.length).toBe(1);

    const view = fixture.debugElement.query(By.css('.m-channel-social-profile-minds'));
    expect(view).not.toBeNull();
  }));

  it('should be able to remove a social field', fakeAsync(() => {
    comp.editing = true;
    comp.socialProfiles = [
      {
        key: 'soundcloud',
        value: 'soundcloud.com/mark'
      }
    ];
    fixture.detectChanges();

    const remove = fixture.debugElement.query(By.css('.m-channel-social-profile-input a'));
    remove.nativeElement.click();

    expect(comp.socialProfiles.length).toBe(0);

  }));

  it('should still support legacy made social links', fakeAsync(() => {
    comp.editing = false;
    let profiles = comp.polyfillLegacy([
      {
        key: 'twitter',
        value: 'markeharding'
      },
      {
        key: 'twitter',
        value: 'twitter.com/markeharding'
      },
      {
        key: 'other',
        value: 'foobar.com'
      },
      {
        key: 'soundcloud',
        value: 'https://soundcloud.com/teamsesh'
      }
    ]);
    fixture.detectChanges();

    expect(profiles[0].key).toBe('twitter');
    expect(profiles[0].value).toBe('https://twitter.com/markeharding');

    expect(profiles[1].key).toBe('twitter');
    expect(profiles[1].value).toBe('twitter.com/markeharding');

    expect(profiles[2].key).toBe('other');
    expect(profiles[2].value).toBe('foobar.com');

    expect(profiles[3].key).toBe('soundcloud');
    expect(profiles[3].value).toBe('https://soundcloud.com/teamsesh');

  }));

  it('should support https social links', fakeAsync(() => {
    comp.editing = false;
    let profiles = comp.polyfillLegacy([
      {
        key: 'soundcloud',
        value: 'https://soundcloud.com/teamsesh'
      }
    ]);
    fixture.detectChanges();

    expect(profiles[0].key).toBe('soundcloud');
    expect(profiles[0].value).toBe('https://soundcloud.com/teamsesh');

    let profileUrl = comp.getSocialProfileURL('https://soundcloud.com/teamsesh');
    expect(profileUrl).toBe('https://soundcloud.com/teamsesh');
  }));

});
