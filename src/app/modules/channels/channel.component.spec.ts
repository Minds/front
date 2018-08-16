///<reference path="../../../../node_modules/@types/jasmine/index.d.ts"/>
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { Mock, MockComponent } from '../../utils/mock';

import { CommonModule as NgCommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Client } from '../../services/api/client';
import { By, Title } from '@angular/platform-browser';
import { clientMock } from '../../../tests/client-mock.spec';
import { uploadMock } from '../../../tests/upload-mock.spec';
import { sessionMock } from '../../../tests/session-mock.spec';
import { MaterialMock } from '../../../tests/material-mock.spec';
import { FormsModule } from '@angular/forms';
import { MaterialSwitchMock } from '../../../tests/material-switch-mock.spec';
import { mindsTitleMock } from '../../mocks/services/ux/minds-title.service.mock.spec';
import { ChannelComponent } from './channel.component';
import { Upload } from '../../services/api';
import { Session } from '../../services/session';
import { MindsTitle } from '../../services/ux/title';
import { scrollServiceMock } from '../../../tests/scroll-service-mock.spec';
import { ScrollService } from '../../services/ux/scroll';
import { recentServiceMock } from '../../../tests/minds-recent-service-mock.spec';
import { RecentService } from '../../services/ux/recent';
import { contextServiceMock } from '../../../tests/context-service-mock.spec';
import { ContextService } from '../../services/context.service';
import { toObservable } from '@angular/forms/src/validators';
import { Observable } from 'rxjs';
import { from } from 'rxjs/internal/observable/from';

describe('ChannelComponent', () => {

  let comp: ChannelComponent;
  let fixture: ComponentFixture<ChannelComponent>;
  
  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [
        MaterialMock, 
        MaterialSwitchMock,
        ChannelComponent,  
        MockComponent({ 
          selector: 'm-channel--supporters',
          inputs: [ 'channel' ],
        }), 
        MockComponent({ 
          selector: 'm-channel--subscriptions',
          inputs: [ 'channel' ],
        }), 
        MockComponent({ 
          selector: 'm-channel--subscribers',
          inputs: [ 'channel' ],
        }),
        MockComponent({ 
          selector: 'm-channel--carousel',
          inputs: [ 'banners', 'editMode' ],
        }), 
        MockComponent({ 
          selector: 'm-channel--feed',
          inputs: [ 'user' ],
        }),
        MockComponent({ 
          selector: 'm-channel--sidebar',
          inputs: [ 'user', 'editing' ],
        }),
        MockComponent({
          selector: 'm-channel--explicit-overlay',
          inputs: [ 'channel' ]
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
        { provide: Session, useValue: sessionMock },
        { provide: MindsTitle, useValue: mindsTitleMock},
        { provide: ScrollService, useValue: scrollServiceMock},
        { provide: RecentService, useValue: recentServiceMock},
        { provide: ContextService, useValue: contextServiceMock},
        { provide: ActivatedRoute, useValue: { 'params': from([{ 'filter': 'feed', 'username': 'username' }]) } }
      ]
    })
      .compileComponents();  // compile template and css
  }));

  beforeEach((done) => {

    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();
    fixture = TestBed.createComponent(ChannelComponent);
    clientMock.response = {};
    uploadMock.response = {};
    comp = fixture.componentInstance;
    comp.username = 'username';
    comp.user = { guid: 'guidguid', name: 'name', username: 'username', icontime: 11111, subscribers_count:182, impressions:18200};
    comp.editing = false;
    fixture.detectChanges();

    clientMock.response[`api/v1/channel/username`] = {
      'status': 'success',
      'channel' : { guid: 'guidguid', name: 'name', username: 'username', icontime: 11111, subscribers_count:182, impressions:18200}
    };

    clientMock.response['api/v1/channel/info'] = {status: 'success'};
    
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

  it('elements should be present in channel page, different filters should load the expected component', () => {
    const carousel = fixture.debugElement.query(By.css('m-channel--carousel'));
    const sidebar = fixture.debugElement.query(By.css('m-channel--sidebar'));
    const feed = fixture.debugElement.query(By.css('m-channel--feed'));
    expect(carousel).not.toBeNull();
    expect(sidebar).not.toBeNull();
    expect(feed).not.toBeNull();
    comp.filter = 'supporters';
    fixture.detectChanges();
    const supporters = fixture.debugElement.query(By.css('m-channel--supporters'));
    expect(supporters).not.toBeNull();
    comp.filter = 'subscribers';
    fixture.detectChanges();
    const subscribers = fixture.debugElement.query(By.css('m-channel--subscriptions'));
    expect(supporters).not.toBeNull();
    comp.filter = 'subscriptors';
    fixture.detectChanges();
    const subscriptors = fixture.debugElement.query(By.css('minds-channel-subscriptors'));
    expect(supporters).not.toBeNull();
  });

  it('should load() on init', () => {
    comp.load();
    fixture.detectChanges();
    expect(clientMock.get.calls.mostRecent().args[0]).toEqual('api/v1/channel/username');
  });

  it('toggle editing should upload', fakeAsync(() => {
    clientMock.response['api/v1/channel/info'] = { status: 'success' };
    comp.editing = true;
    comp.toggleEditing();
    tick();
    fixture.detectChanges();

    expect(comp.editing).toBe(false);
    expect(clientMock.post.calls.mostRecent().args[0]).toEqual('api/v1/channel/info');
  }));

  it('update carousel makes post call if arg is correct', () => {
    let arg = [ {guid: '1111', top: '111', file: {}}];
    comp.toggleEditing();
    fixture.detectChanges();
    expect(comp.editing).toBe(true);
    comp.updateCarousels(arg);
    fixture.detectChanges();
    expect(uploadMock.post.calls.mostRecent().args[0]).toEqual('api/v1/channel/carousel');
  });

  it('remove carousel makes delete call if arg is correct', () => {
    let arg = {guid: '1111', top: '111', file: {}};
    comp.toggleEditing();
    fixture.detectChanges();
    expect(comp.editing).toBe(true);
    comp.removeCarousel(arg);
    fixture.detectChanges();
    expect(clientMock.delete.calls.mostRecent().args[0]).toEqual('api/v1/channel/carousel/1111');
  });

  it('unblock should make the request ', () => {
    comp.unBlock();
    fixture.detectChanges();
    expect(clientMock.delete.calls.mostRecent().args[0]).toEqual('api/v1/block/guidguid');
  });

});
