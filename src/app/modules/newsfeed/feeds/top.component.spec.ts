import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
} from '@angular/core/testing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { CommonModule } from '@angular/common';

import { MockComponent } from '../../../utils/mock';

import { By } from '@angular/platform-browser';
import { NewsfeedTopComponent } from './top.component';
import { MaterialMock } from '../../../../tests/material-mock.spec';
import { uploadMock } from '../../../../tests/upload-mock.spec';
import { navigationMock } from '../../../../tests/navigation-service-mock.spec';
import { Upload } from '../../../services/api/upload';
import { Navigation } from '../../../services/navigation';
import { clientMock } from '../../../../tests/client-mock.spec';
import { sessionMock } from '../../../../tests/session-mock.spec';
import { Session } from '../../../services/session';
import { storageMock } from '../../../../tests/storage-mock.spec';
import { ContextService } from '../../../services/context.service';
import { contextServiceMock } from '../../../../tests/context-service-mock.spec';
import { Client } from '../../../services/api/client';
import { Storage } from '../../../services/storage';
import { SettingsService } from '../../settings/settings.service';
import { settingsServiceMock } from '../../../mocks/modules/settings/settings.service.mock.spec';

import { overlayModalServiceMock } from '../../../../tests/overlay-modal-service-mock.spec';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { NewsfeedService } from '../services/newsfeed.service';
import { newsfeedServiceMock } from '../../../mocks/modules/newsfeed/services/newsfeed-service.mock';

describe('NewsfeedTopComponent', () => {
  let comp: NewsfeedTopComponent;
  let fixture: ComponentFixture<NewsfeedTopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MaterialMock,
        MockComponent({
          selector: 'm-newsfeed--boost-rotator',
          inputs: ['interval', 'channel'],
        }),
        MockComponent({
          selector: 'minds-activity',
          inputs: [
            'object',
            'boostToggle',
            'showRatingToggle',
            'boost',
            'showBoostMenuOptions',
          ],
          outputs: ['delete'],
        }),
        MockComponent({
          selector: 'infinite-scroll',
          inputs: ['inProgress', 'moreData', 'inProgress'],
        }),
        MockComponent({
          selector: 'm-hashtags-selector',
          inputs: ['tags', 'alignLeft'],
          outputs: ['tagsChange', 'tagsAdded', 'tagsRemoved'],
        }),
        MockComponent({
          selector: 'minds-newsfeed-poster',
          inputs: ['containerGuid', 'accessId', 'message'],
        }),
        NewsfeedTopComponent,
      ],
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        CommonModule,
        FormsModule,
      ],
      providers: [
        { provide: Session, useValue: sessionMock },
        { provide: Client, useValue: clientMock },
        { provide: Navigation, useValue: navigationMock },
        { provide: Upload, useValue: uploadMock },
        { provide: Storage, useValue: storageMock },
        { provide: ContextService, useValue: contextServiceMock },
        { provide: SettingsService, useValue: settingsServiceMock },
        { provide: OverlayModalService, useValue: overlayModalServiceMock },
        { provide: NewsfeedService, useValue: newsfeedServiceMock },
      ],
    }).compileComponents();
  }));

  beforeEach(done => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().install();

    fixture = TestBed.createComponent(NewsfeedTopComponent);

    comp = fixture.componentInstance;

    clientMock.response = {};
    clientMock.response['api/v2/entities/suggested/activities'] = {
      status: 'success',
      entities: [
        {
          guid: '1',
          type: 'activity',
          time_created: '1525457795',
          time_updated: '1525457795',
          title: '',
          message: 'test',
          boosted: true,
          boosted_guid: '1',
        },
        {
          guid: '2',
          type: 'activity',
          message: 'test2',
          boosted: true,
          boosted_guid: 2,
        },
      ],
      'load-next': '',
    };

    sessionMock.user.boost_rating = 1;

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

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should have an infinite-scroll', () => {
    expect(fixture.debugElement.query(By.css('infinite-scroll'))).toBeTruthy();
  });

  it('should have a list of activities', () => {
    expect(clientMock.get).toHaveBeenCalled();
    const call = clientMock.get.calls.mostRecent();
    expect(call.args[0]).toBe('api/v2/entities/suggested/activities');
    expect(call.args[1]).toEqual({ limit: 12, offset: '', rating: 1 });
    expect(call.args[2]).toEqual({ cache: true });
    const list = fixture.debugElement.query(By.css('.minds-list'));
    expect(list.nativeElement.children.length).toBe(4); // poster + 2 activities + infinite-scroll
  });

  it("should reload the list if the user's content rating changed ", fakeAsync(() => {
    clientMock.get.calls.reset();
    settingsServiceMock.setRating(2);
    jasmine.clock().tick(10);
    fixture.detectChanges();

    expect(comp.rating).toBe(2);

    const call = clientMock.get.calls.mostRecent();
    expect(call.args[0]).toBe('api/v2/entities/suggested/activities');
    expect(call.args[1]).toEqual({ limit: 12, offset: '', rating: 2 });
    expect(call.args[2]).toEqual({ cache: true });
  }));
});
