///<reference path="../../../../../node_modules/@types/jasmine/index.d.ts"/>
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { MockComponent } from '../../../utils/mock';

import { CommonModule as NgCommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Client } from '../../../services/api/client';
import { By } from '@angular/platform-browser';
import { clientMock } from '../../../../tests/client-mock.spec';
import { uploadMock } from '../../../../tests/upload-mock.spec';
import { sessionMock } from '../../../../tests/session-mock.spec';
import { AbbrPipe } from '../../../common/pipes/abbr';
import { TagsPipe } from '../../../common/pipes/tags';
import { MaterialMock } from '../../../../tests/material-mock.spec';
import { FormsModule } from '@angular/forms';
import { MaterialSwitchMock } from '../../../../tests/material-switch-mock.spec';
import { ChannelSidebar } from './sidebar';
import { AutoGrow } from '../../../common/directives/autogrow';
import { Upload } from '../../../services/api';
import { Session } from '../../../services/session';

describe('ChannelSidebar', () => {

  let comp: ChannelSidebar;
  let fixture: ComponentFixture<ChannelSidebar>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MaterialMock, 
        MaterialSwitchMock, 
        AbbrPipe, 
        ChannelSidebar, 
        MockComponent({ 
          selector: 'm-channel--social-profiles',
          inputs: [ 'user', 'editing' ],
        }), 
        TagsPipe, 
        MockComponent({ 
          selector: 'm-wire-channel',
          inputs: [ 'channel', 'editing', 'rewards' ],
        }),
        MockComponent({ 
          selector: 'minds-button-boost',
          inputs: [ 'object' ],
        }), 
        MockComponent({ 
          selector: 'minds-button-user-dropdown',
          inputs: [ 'user' ],
        }),
        MockComponent({ 
          selector: 'm-channel--modules',
          inputs: [ 'type', 'owner', 'linksTo', 'limit', 'container' ],
        }),
        AutoGrow,
        MockComponent({ 
          selector: 'minds-avatar',
          inputs: [ 'object', 'src', 'editMode', 'waitForDoneSignal' ],
        }),
        MockComponent({ 
          selector: 'm-channel--badges',
          inputs: [ 'user', 'badges' ],
        }),
        MockComponent({ 
          selector: 'm-messenger--channel-button',
          inputs: [ 'user' ],
        }),
        MockComponent({ 
          selector: 'minds-button-subscribe',
          inputs: [ 'user' ],
        }),
        MockComponent({
          selector: 'm-hashtags-selector',
          inputs: ['tags', 'alignLeft'],
          outputs: ['tagsChange', 'tagsAdded', 'tagsRemoved'],
        }),
      ],
      imports: [
        FormsModule,
        RouterTestingModule,
        NgCommonModule
      ],
      providers: [
        { provide: Client, useValue: clientMock },
        { provide: Upload, useValue: uploadMock },
        { provide: Session, useValue: sessionMock }
      ]
    })
      .compileComponents();  // compile template and css
  }));

  beforeEach((done) => {

    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();
    fixture = TestBed.createComponent(ChannelSidebar);
    clientMock.response = {};
    uploadMock.response = {};
    comp = fixture.componentInstance;
    comp.user = { guid: 'guidguid', name: 'name', username: 'username',city: 'awasa', icontime: 11111, subscribers_count:182, impressions:18200};
    comp.editing = false;
    uploadMock.response[`api/v1/channel/avatar`] = {
      'status': 'success',
    };
    clientMock.response[`api/v1/geolocation/list`] = {
      "status":"success",
      "results":[{"address":{"city":"Wichita","state":"Kansas, United States"},"lat":37.6650225,"lon":-97.33538500000002}]
    };
    window.Minds.user = {
      "guid": "732337264197111809",
      "type": "user",
      "subtype": false,
      "time_created": "1499978809",
      "time_updated": false,
      "container_guid": "0",
      "owner_guid": "0",
      "site_guid": false,
      "access_id": "2",
      "name": "minds",
      "username": "minds",
      "language": "en",
      "icontime": "1506690756",
      "legacy_guid": false,
      "featured_id": false,
      "banned": "no",
      "website": "",
      "dob": "",
      "gender": "",
      "city": "",
      "merchant": {},
      "boostProPlus": false,
      "fb": false,
      "mature": 0,
      "monetized": "",
      "signup_method": false,
      "social_profiles": [],
      "feature_flags": false,
      "programs": ["affiliate"],
      "plus": false,
      "verified": false,
      "disabled_boost": false,
      "show_boosts": false,
      "chat": true,
      "subscribed": false,
      "subscriber": false,
      "subscriptions_count": 1,
      "impressions": 10248,
      "boost_rating": "2",
      "spam": 0,
      "deleted": 0
    };
    
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

  it('bio container should be present, username and name should be correct', () => {
    const bio = fixture.debugElement.query(By.css('.m-channel--bio'));
    const name = fixture.debugElement.query(By.css('.m-channel--name h2'));
    const username = fixture.debugElement.query(By.css('.m-channel--username h2'));
    const counters = fixture.debugElement.queryAll(By.css('.m-channel--stats a'));
    expect(username.nativeElement.innerText).toBe('@username');
    expect(name.nativeElement.innerText).toBe('name');
    expect(bio).not.toBeNull();
    expect(counters.length).toBe(2);
  });

  it('bio container should not be editable if not the owner', () => {

    fixture.detectChanges();
    const edit_tick = fixture.debugElement.query(By.css('.minds-button-edit'));
    expect(edit_tick).toBeNull();
  });

  it('bio container should be editable if its the owner', () => {
    comp.user.guid = '1000';
    const edit_tick = fixture.debugElement.query(By.css('.minds-button-edit'));
    expect(edit_tick).toBeNull();
  });

  it('bio container should be editable if its the owner, should send event when saving, and returning to original state', () => {
    spyOn(comp, 'toggleEditing');
    comp.user.guid = '1000';
    fixture.detectChanges();
    const edit_tick = fixture.debugElement.query(By.css('.minds-button-edit'));
    edit_tick.nativeElement.click();
    fixture.detectChanges();
    expect(comp.toggleEditing).toHaveBeenCalled();
  });

  it('city in bio container should be editable if its the owner', () => {
    comp.user.guid = '1000';
    comp.editing = true;
    fixture.detectChanges();
    const city = fixture.debugElement.query(By.css('.m-channel-city-editor'));
    expect(city).not.toBeNull();
  });

  it('should show wire and token counters and rewards component', () => {
    const container = fixture.debugElement.query(By.css('m-wire-channel'));
    expect(container).not.toBeNull();
  });

  it('modules container should be present', () => {
    const mdules = fixture.debugElement.query(By.css('m-channel--modules'));
    expect(mdules).not.toBeNull();
  });

  it('should try to upload the avatar', fakeAsync(() => {
    comp.upload_avatar({});
    fixture.detectChanges();
    expect(uploadMock.post.calls.mostRecent().args[0]).toEqual('api/v1/channel/avatar');
    tick();
    fixture.detectChanges();
    expect(comp.user.icontime).toBeGreaterThan(11111);
  }));

  it('should try to load the cities', fakeAsync(() => {
    comp.findCity('');
    tick(210);
    jasmine.clock().tick(210);
    fixture.detectChanges();
    expect(clientMock.get.calls.mostRecent().args[0]).toEqual('api/v1/geolocation/list');
    tick(210);
    jasmine.clock().tick(210);
    fixture.detectChanges();
    expect(comp.cities.length).toBe(1);
  }));

  it('should set the city', () => {
    comp.cities = [{"address":{"city":"Wichita","state":"Kansas, United States"},"lat":37.6650225,"lon":-97.33538500000002}];
    comp.setCity({"address": {city:"Wichita","state":"Kansas, United States"}});
    fixture.detectChanges();
    expect(comp.user.city).toBe("Wichita");
  });

  it('should set the city by town', () => {
    comp.cities = [{"address":{"town":"Wichita","state":"Kansas, United States"},"lat":37.6650225,"lon":-97.33538500000002}];
    comp.setCity({"address": {town:"Wichita","state":"Kansas, United States"}});
    fixture.detectChanges();
    comp.setSocialProfile([]);
    comp.isOwner();
    expect(comp.user.city).toBe("Wichita");
  });

  it('should emit event', () => {
    spyOn(comp.changeEditing, 'next').and.callThrough();
    comp.toggleEditing();
    fixture.detectChanges();
    expect(comp.changeEditing.next).toHaveBeenCalled();
  });

});
