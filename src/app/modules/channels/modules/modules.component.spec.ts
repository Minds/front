///<reference path="../../../../../node_modules/@types/jasmine/index.d.ts"/>
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { Mock, MockComponent } from '../../../utils/mock';

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
import { MindsCardMock } from '../../../../tests/minds-card-mock.spec';
import { MaterialSwitchMock } from '../../../../tests/material-switch-mock.spec';
import { attachmentServiceMock } from '../../../../tests/attachment-service-mock.spec';
import { ChannelModulesComponent } from './modules';
import { AutoGrow } from '../../../common/directives/autogrow';
import { Upload } from '../../../services/api';
import { Session } from '../../../services/session';
import { AttachmentService } from '../../../services/attachment';

describe('ChannelModulesComponent', () => {

  let comp: ChannelModulesComponent;
  let fixture: ComponentFixture<ChannelModulesComponent>;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [
        MaterialMock, 
        MaterialSwitchMock, 
        AbbrPipe, 
        ChannelModulesComponent,
        MockComponent({
          selector: 'minds-card',
          inputs: [ 'object'],
        })], 
      imports: [
        FormsModule,
        RouterTestingModule,
        NgCommonModule
      ],
      providers: [
        { provide: Client, useValue: clientMock },
        { provide: AttachmentService, useValue: attachmentServiceMock },
        { provide: Session, useValue: sessionMock }
      ]
    })
      .compileComponents();  // compile template and css
  }));

  beforeEach((done) => {

    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();
    fixture = TestBed.createComponent(ChannelModulesComponent);
    clientMock.response = {};
    comp = fixture.componentInstance;
    comp.owner = { 
      guid: 'guidguid', 
      name: 'name', 
      username: 'username', 
      icontime: 11111, 
      subscribers_count:182, 
      impressions:18200, 
      pinned_posts: ['a', 'b', 'c']
    };

    clientMock.response[`api/v1/entities/owner/all/guidguid`] = {
      'status': 'success',
      'entities' : [{},{},{}]
    };
    clientMock.response[`api/v1/blog/owner/guidguid`] = {
      'status': 'success',
      'blogs' : [{},{},{}]
    };
    clientMock.response[`api/v1/entities/owner/image/guidguid`] = {
      'status': 'success',
      'entities' : [{},{},{}]
    };
    clientMock.response[`api/v1/entities/owner/video/guidguid`] = {
      'status': 'success',
      'entities' : [{},{},{}]
    };

    clientMock.response[`api/v1/entities/container/all/guidguid`] = {
      'status': 'success',
      'entities' : [{},{},{}]
    };
    clientMock.response[`api/v1/blog/container/guidguid`] = {
      'status': 'success',
      'blogs' : [{},{},{}]
    };
    clientMock.response[`api/v1/entities/container/image/guidguid`] = {
      'status': 'success',
      'entities' : [{},{},{}]
    };
    clientMock.response[`api/v1/entities/container/video/guidguid`] = {
      'status': 'success',
      'entities' : [{},{},{}]
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

  it('should load all entities', fakeAsync(() => {
    comp.load();
    fixture.detectChanges();
    tick();
    expect(comp.items.length).toBe(3);
    expect(clientMock.get.calls.mostRecent().args[0]).toEqual('api/v1/entities/owner/all/guidguid');
  }));

  it('should load blogs', fakeAsync(() => {
    comp.type = 'blog';
    comp.load();
    fixture.detectChanges();
    tick();
    expect(comp.items.length).toBe(3);
    expect(clientMock.get.calls.mostRecent().args[0]).toEqual('api/v1/blog/owner/guidguid');
  }));


  it('should load images', fakeAsync(() => {
    comp.type = 'image';
    comp.load();
    fixture.detectChanges();
    tick();
    expect(comp.items.length).toBe(3);
    expect(clientMock.get.calls.mostRecent().args[0]).toEqual('api/v1/entities/owner/image/guidguid');
  }));


  it('should load videos', fakeAsync(() => {
    comp.type = 'video';
    comp.load();
    fixture.detectChanges();
    tick();
    expect(comp.items.length).toBe(3);
    expect(clientMock.get.calls.mostRecent().args[0]).toEqual('api/v1/entities/owner/video/guidguid');
  }));

  it('should load all entities when owner not set', fakeAsync(() => {
    comp.container = { 
      guid: 'guidguid', 
    };
    comp.owner = null;
    comp.load();
    fixture.detectChanges();
    tick();
    expect(comp.items.length).toBe(3);
    expect(clientMock.get.calls.mostRecent().args[0]).toEqual('api/v1/entities/container/all/guidguid');
  }));

  it('should load blogs  when owner not set', fakeAsync(() => {
    comp.container = { 
      guid: 'guidguid', 
    };
    comp.owner = null;
    comp.type = 'blog';
    comp.load();
    fixture.detectChanges();
    tick();
    expect(comp.items.length).toBe(3);
    expect(clientMock.get.calls.mostRecent().args[0]).toEqual('api/v1/blog/container/guidguid');
  }));


  it('should load images when owner not set', fakeAsync(() => {
    comp.owner = null;
    comp.container = { 
      guid: 'guidguid', 
    };
    comp.type = 'image';
    comp.load();
    fixture.detectChanges();
    tick();
    expect(comp.items.length).toBe(3);
    expect(clientMock.get.calls.mostRecent().args[0]).toEqual('api/v1/entities/container/image/guidguid');
  }));


  it('should load videos when owner not set', fakeAsync(() => {
    comp.owner = null;
    comp.container = { 
      guid: 'guidguid', 
    };
    comp.type = 'video';
    comp.load();
    fixture.detectChanges();
    tick();
    expect(comp.items.length).toBe(3);
    expect(clientMock.get.calls.mostRecent().args[0]).toEqual('api/v1/entities/container/video/guidguid');
  }));

});
