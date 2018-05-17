///<reference path="../../../../../node_modules/@types/jasmine/index.d.ts"/>
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Component, Input, DebugElement } from '@angular/core';


import { CommonModule as NgCommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
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
import { ChannelSupporters } from './supporters';
import { AutoGrow } from '../../../common/directives/autogrow';
import { Upload } from '../../../services/api';
import { Session } from '../../../services/session';
import { AttachmentService } from '../../../services/attachment';
import { InfiniteScrollMock } from '../../../../tests/infinite-scroll-mock.spec';

import { MockComponent } from '../../../utils/mock';

describe('ChannelSupporters', () => {

  let comp: ChannelSupporters;
  let fixture: ComponentFixture<ChannelSupporters>;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [
        MaterialMock, 
        MaterialSwitchMock, 
        AbbrPipe, 
        ChannelSupporters,
        MockComponent({
          selector: 'minds-card',
          inputs: [ 'object'],
        }),
        MockComponent({
          selector: 'minds-card-user',
          inputs: [ 'object'],
        }),
        MockComponent({
          selector: 'infinite-scroll',
          inputs: [ 'inProgress', 'moreData', 'inProgress' ],
        }), 
      ], 
      imports: [
        FormsModule,
        RouterTestingModule,
        NgCommonModule
      ],
      providers: [
        { provide: Client, useValue: clientMock },
        { provide: AttachmentService, useValue: attachmentServiceMock },
        { provide: Session, useValue: InfiniteScrollMock },
      ]
    })
      .compileComponents();  // compile template and css
  }));

  beforeEach((done) => {

    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();
    fixture = TestBed.createComponent(ChannelSupporters);
    clientMock.response = {};
    comp = fixture.componentInstance;
    comp.channel = { 
      guid: 'guid', 
      name: 'name', 
      username: 'username', 
      icontime: 11111, 
      subscribers_count:182, 
      impressions:18200, 
      pinned_posts: ['a', 'b', 'c']
    };

    clientMock.response[`api/v1/payments/subscribers/guid/exclusive`] = {
      'status': 'success',
      'subscribers' : [{},{},{}]
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
    expect(comp.users.length).toBe(3);
    expect(clientMock.get.calls.mostRecent().args[0]).toEqual('api/v1/payments/subscribers/guid/exclusive');
  }));

});
