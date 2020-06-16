///<reference path="../../../../../node_modules/@types/jasmine/index.d.ts"/>
import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { Mock, MockComponent, MockService } from '../../../utils/mock';

import { CommonModule as NgCommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Client } from '../../../services/api/client';
import { By } from '@angular/platform-browser';
import { clientMock } from '../../../../tests/client-mock.spec';
import { uploadMock } from '../../../../tests/upload-mock.spec';
import { sessionMock } from '../../../../tests/session-mock.spec';
import { WireChannelComponent } from '../../../modules/wire/channel/channel.component';
import { MaterialMock } from '../../../../tests/material-mock.spec';
import { FormsModule } from '@angular/forms';
import { MaterialSwitchMock } from '../../../../tests/material-switch-mock.spec';
import { ChannelFeedComponent } from './feed';
import { scrollServiceMock } from '../../../../tests/scroll-service-mock.spec';
import { Upload } from '../../../services/api';
import { Session } from '../../../services/session';
import { ScrollService } from '../../../services/ux/scroll';
import { FeaturesService } from '../../../services/features.service';
import { featuresServiceMock } from '../../../../tests/features-service-mock.spec';
import { FeedsService } from '../../../common/services/feeds.service';
import { ChannelMode } from '../../../interfaces/entities';
import { IfFeatureDirective } from '../../../common/directives/if-feature.directive';

describe('ChannelFeed', () => {
  let comp: ChannelFeedComponent;
  let fixture: ComponentFixture<ChannelFeedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        IfFeatureDirective,
        MaterialMock,
        MaterialSwitchMock,
        ChannelFeedComponent,
        MockComponent({
          selector: 'm-composer',
          inputs: ['containerGuid', 'activity'],
        }),
        MockComponent({
          selector: 'minds-newsfeed-poster',
          inputs: ['containerGuid', 'accessId', 'message'],
        }),
        MockComponent({
          selector: 'm-onboarding-feed',
        }),
        MockComponent({
          selector: 'm-newsfeed--boost-rotator',
          inputs: ['interval', 'channel'],
        }),
        MockComponent({
          selector: 'minds-activity',
          inputs: ['object', 'boostToggle', 'allowAutoplayOnScroll'],
        }),
        MockComponent({
          selector: 'infinite-scroll',
          inputs: ['inProgress', 'moreData', 'inProgress'],
        }),
      ],
      imports: [FormsModule, RouterTestingModule, NgCommonModule],
      providers: [
        { provide: Client, useValue: clientMock },
        { provide: Upload, useValue: uploadMock },
        { provide: Session, useValue: sessionMock },
        { provide: ScrollService, useValue: scrollServiceMock },
        { provide: FeaturesService, useValue: featuresServiceMock },
        { provide: FeedsService, useValue: MockService(FeedsService) },
      ],
    }).compileComponents(); // compile template and css
  }));

  beforeEach(done => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();
    fixture = TestBed.createComponent(ChannelFeedComponent);
    clientMock.response = {};
    comp = fixture.componentInstance;
    comp.user = {
      type: 'user',
      guid: 'guidguid',
      name: 'name',
      username: 'username',
      icontime: 11111,
      subscribers_count: 182,
      impressions: 18200,
      pinned_posts: ['a', 'b', 'c'],
      mode: ChannelMode.PUBLIC,
      nsfw: [],
      time_created: 11111,
    };
    comp.feed = [
      { guid: 'aaaa' },
      { guid: 'aaaa' },
      { guid: 'aaaa' },
      { guid: 'aaaa' },
    ];
    comp.openWireModal = false;
    featuresServiceMock.mock('activity-composer', true);
    fixture.detectChanges();

    clientMock.response[`api/v1/newsfeed/personal/1000`] = {
      status: 'success',
      'load-next': 'aaaa',
      pinned: [{ guid: 'aaa3a' }],
      activity: [
        { guid: 'aaa3a' },
        { guid: 'aaaa' },
        { guid: 'aaaa' },
        { guid: 'aaaa' },
        { guid: 'aaaa' },
      ],
    };
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

  it('composer should be on top if owner', () => {
    comp.user.guid = '1000';
    fixture.detectChanges();
    const composer = fixture.debugElement.query(By.css('m-composer'));
    const activities = fixture.debugElement.queryAll(By.css('minds-activity'));
    expect(activities.length).toBe(0);
    expect(composer).not.toBeNull();
  });

  it('composer shouldnt be on top if not owner', () => {
    comp.user.guid = '10010';
    const composer = fixture.debugElement.query(By.css('m-composer'));
    const activities = fixture.debugElement.queryAll(By.css('minds-activity'));
    expect(activities.length).toBe(0);
    expect(composer).toBeNull();
  });

  it('should render the activities when refresh, removing the existent ones', fakeAsync(() => {
    comp.user.guid = '1000';
    comp.loadFeed(true);
    fixture.detectChanges();
    expect(clientMock.get.calls.mostRecent().args[0]).toEqual(
      'api/v1/newsfeed/personal/1000'
    );
    tick();
    fixture.detectChanges();
    const activities = fixture.debugElement.queryAll(By.css('minds-activity'));
    expect(comp.feed.length).toBe(5);
    expect(comp.offset).toBe('aaaa');
    expect(activities.length).toBe(6);
  }));

  it('should render the activities, delete one when deleted', fakeAsync(() => {
    comp.user.guid = '1000';
    comp.loadFeed(true);
    fixture.detectChanges();
    expect(clientMock.get.calls.mostRecent().args[0]).toEqual(
      'api/v1/newsfeed/personal/1000'
    );
    tick();
    comp.delete(comp.feed[2]);
    tick();
    fixture.detectChanges();
    const activities = fixture.debugElement.queryAll(By.css('minds-activity'));
    expect(comp.feed.length).toBe(4);
    expect(comp.offset).toBe('aaaa');
    expect(activities.length).toBe(5);
  }));

  it('should render the activities, prepend when posted', fakeAsync(() => {
    comp.user.guid = '1000';
    comp.loadFeed(true);
    fixture.detectChanges();
    expect(clientMock.get.calls.mostRecent().args[0]).toEqual(
      'api/v1/newsfeed/personal/1000'
    );
    tick();
    comp.prepend(comp.feed[1]);
    tick();
    fixture.detectChanges();
    const activities = fixture.debugElement.queryAll(By.css('minds-activity'));
    expect(comp.feed.length).toBe(6);
    expect(comp.offset).toBe('aaaa');
    expect(activities.length).toBe(7);
  }));

  it('should add the activities when no refresh', fakeAsync(() => {
    comp.user.guid = '1000';
    comp.loadFeed(false);
    let activities = fixture.debugElement.queryAll(By.css('minds-activity'));
    fixture.detectChanges();
    expect(comp.feed.length).toBe(0);
    expect(activities.length).toBe(0);
    tick();
    expect(clientMock.get.calls.mostRecent().args[0]).toEqual(
      'api/v1/newsfeed/personal/1000'
    );
    fixture.detectChanges();
    activities = fixture.debugElement.queryAll(By.css('minds-activity'));
    expect(comp.feed.length).toBe(5);
    expect(activities.length).toBe(5);
  }));

  it('should keep loading when scroll down', fakeAsync(() => {
    comp.user.guid = '1000';
    comp.loadFeed(false);
    let activities = fixture.debugElement.queryAll(By.css('minds-activity'));
    fixture.detectChanges();
    expect(comp.feed.length).toBe(0);
    expect(activities.length).toBe(0);
    tick();
    expect(clientMock.get.calls.mostRecent().args[0]).toEqual(
      'api/v1/newsfeed/personal/1000'
    );
    fixture.detectChanges();
    activities = fixture.debugElement.queryAll(By.css('minds-activity'));
    expect(comp.feed.length).toBe(5);
    expect(comp.isOwner()).toBe(true);
    expect(activities.length).toBe(5);
    clientMock.response[`api/v1/newsfeed/personal/1000`] = {
      status: 'success',
      activity: [{ guid: 'aaaa' }, { guid: 'aaaa' }],
    };
    comp.loadFeed();
    tick();
    fixture.detectChanges();
    activities = fixture.debugElement.queryAll(By.css('minds-activity'));
    expect(comp.feed.length).toBe(7);
    expect(activities.length).toBe(7);
    clientMock.response[`api/v1/newsfeed/personal/1000`] = {
      status: 'success',
    };
    comp.loadFeed();
    tick();
    fixture.detectChanges();
    tick();
    expect(comp.moreData).toBe(false);
  }));
});
