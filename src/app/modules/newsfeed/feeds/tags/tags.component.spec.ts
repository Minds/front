import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { CommonModule } from '@angular/common';

import { By } from '@angular/platform-browser';
import { NewsfeedTagsComponent } from './tags.component';
import { MaterialMock } from '../../../../../tests/material-mock.spec';
import { MockComponent } from '../../../../utils/mock';
import { Client } from '../../../../services/api/client';
import { clientMock } from '../../../../../tests/client-mock.spec';
import { Navigation } from '../../../../services/navigation';
import { navigationMock } from '../../../../../tests/navigation-service-mock.spec';
import { Upload } from '../../../../services/api/upload';
import { uploadMock } from '../../../../../tests/upload-mock.spec';
import { Storage } from '../../../../services/storage';
import { storageMock } from '../../../../../tests/storage-mock.spec';
import { ContextService } from '../../../../services/context.service';
import { contextServiceMock } from '../../../../../tests/context-service-mock.spec';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('NewsfeedTagsComponent', () => {
  let comp: NewsfeedTagsComponent;
  let fixture: ComponentFixture<NewsfeedTagsComponent>;

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
        NewsfeedTagsComponent,
      ],
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        CommonModule,
        FormsModule,
      ],
      providers: [
        { provide: Client, useValue: clientMock },
        { provide: Navigation, useValue: navigationMock },
        { provide: Upload, useValue: uploadMock },
        { provide: Storage, useValue: storageMock },
        { provide: ContextService, useValue: contextServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ tag: 'hashtag' }),
          },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(done => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().install();

    fixture = TestBed.createComponent(NewsfeedTagsComponent);

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
    fixture.detectChanges();
    expect(clientMock.get).toHaveBeenCalled();
    const call = clientMock.get.calls.mostRecent();
    console.warn(comp);
    expect(call.args[0]).toBe('api/v2/entities/suggested/activities');
    expect(call.args[1]).toEqual({ limit: 12, offset: 0, hashtag: 'hashtag' });
    const list = fixture.debugElement.query(By.css('.minds-list'));
    expect(list.nativeElement.children.length).toBe(3); // 2 activities + infinite-scroll
  });
});
