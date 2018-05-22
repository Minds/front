import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { CommonModule } from '@angular/common';

import { MockComponent, MockDirective } from '../../../utils/mock';
import { By } from '@angular/platform-browser';
import { NewsfeedBoostComponent } from './boost.component';
import { Session } from '../../../services/session';
import { sessionMock } from '../../../../tests/session-mock.spec';
import { clientMock } from '../../../../tests/client-mock.spec';
import { Client } from '../../../services/api/client';
import { Navigation } from '../../../services/navigation';
import { navigationMock } from '../../../../tests/navigation-service-mock.spec';
import { MindsTitle } from '../../../services/ux/title';
import { mindsTitleMock } from '../../../mocks/services/ux/minds-title.service.mock.spec';
import { Upload } from '../../../services/api/upload';
import { uploadMock } from '../../../../tests/upload-mock.spec';
import { storageMock } from '../../../../tests/storage-mock.spec';
import { Storage } from '../../../services/storage';
import { ContextService } from '../../../services/context.service';
import { contextServiceMock } from '../../../../tests/context-service-mock.spec';

@Component({
  selector: 'm-newsfeed--boost-rotator',
  template: ''
})
class NewsfeedBoostRotatorComponentMock {
  @Input() interval: any;
  @Input() channel: any;
}

@Component({
  selector: 'minds-activity',
  template: ''
})
class MindsActivityMock {
  @Input() object: any;
  @Input() boostToggle;
  @Input() boost;
  @Input() showBoostMenuOptions: boolean;
  @Output() delete: EventEmitter<any> = new EventEmitter<any>();
}

describe('NewsfeedBoostComponent', () => {

  let comp: NewsfeedBoostComponent;
  let fixture: ComponentFixture<NewsfeedBoostComponent>;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [
        MockDirective({ selector: '[mdl]', inputs: ['mdl'] }),
        MockComponent({ selector: 'm-newsfeed--boost-rotator', template: '', inputs: ['interval', 'channel'] }),
        MindsActivityMock,
        MockComponent({
          selector: 'infinite-scroll',
          inputs: ['inProgress', 'moreData', 'inProgress'],
        }),
        NewsfeedBoostComponent
      ],
      imports: [RouterTestingModule, ReactiveFormsModule, CommonModule, FormsModule],
      providers: [
        { provide: Session, useValue: sessionMock },
        { provide: Client, useValue: clientMock },
        { provide: MindsTitle, useValue: mindsTitleMock },
        { provide: Navigation, useValue: navigationMock },
        { provide: Upload, useValue: uploadMock },
        { provide: Storage, useValue: storageMock },
        { provide: ContextService, useValue: contextServiceMock },
      ]
    })
      .compileComponents();
  }));

  beforeEach((done) => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().install();

    fixture = TestBed.createComponent(NewsfeedBoostComponent);

    comp = fixture.componentInstance;

    clientMock.response = {};
    clientMock.response['api/v1/boost/fetch/newsfeed'] = {
      status: 'success',
      boosts: [
        {
          'guid': '1',
          'type': 'activity',
          'time_created': '1525457795',
          'time_updated': '1525457795',
          'title': '',
          'message': 'test',
          'boosted': true,
          'boosted_guid': '1'
        }, {
          'guid': '2',
          'type': 'activity',
          'message': 'test2',
          'boosted': true,
          'boosted_guid': 2
        }
      ],
      'load-next': ''
    };

    fixture.detectChanges();

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable()
        .then(() => {
          fixture.detectChanges();
          done()
        });
    }
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should have a boost rotator', () => {
    expect(fixture.debugElement.query(By.css('m-newsfeed--boost-rotator'))).toBeTruthy();
  });

  it('should have an infinite-scroll', () => {
    expect(fixture.debugElement.query(By.css('infinite-scroll'))).toBeTruthy();
  });

  it('should have a list of activities', () => {
    expect(clientMock.get).toHaveBeenCalled();
    const call = clientMock.get.calls.mostRecent();
    expect(call.args[0]).toBe('api/v1/boost/fetch/newsfeed');
    expect(call.args[1]).toEqual({ limit: 12, offset: '' });
    expect(call.args[2]).toEqual({ cache: true });

    const list = fixture.debugElement.query(By.css('.minds-list'));
    expect(list.nativeElement.children.length).toBe(4); // 2 activities + boost rotator + infinite-scroll
  });

});
