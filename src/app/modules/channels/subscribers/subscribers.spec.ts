import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';


import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { Client } from '../../../services/api/client';
import { clientMock } from '../../../../tests/client-mock.spec';
import { sessionMock } from '../../../../tests/session-mock.spec';
import { AbbrPipe } from '../../../common/pipes/abbr';
import { FormsModule } from '@angular/forms';
import { attachmentServiceMock } from '../../../../tests/attachment-service-mock.spec';
import { ChannelSubscribers } from './subscribers';
import { Session } from '../../../services/session';
import { AttachmentService } from '../../../services/attachment';

import { MockComponent, MockDirective } from '../../../utils/mock';
import { By } from '@angular/platform-browser';

describe('ChannelSubscribers', () => {
  let comp: ChannelSubscribers;
  let fixture: ComponentFixture<ChannelSubscribers>;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [
        MockDirective({ selector: '[mdl]', inputs: ['mdl'] }),
        MockDirective({ selector: '[mdlSwitch]', inputs: ['mdlSwitch', 'toggled'] }),
        MockComponent({
          selector: 'minds-card',
          inputs: ['object'],
        }),
        MockComponent({
          selector: 'minds-card-user',
          inputs: ['object'],
        }),
        MockComponent({
          selector: 'infinite-scroll',
          inputs: ['inProgress', 'moreData', 'inProgress'],
        }),
        AbbrPipe,
        ChannelSubscribers,
      ],
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
    fixture = TestBed.createComponent(ChannelSubscribers);
    clientMock.response = {};
    comp = fixture.componentInstance;
    comp.channel = {
      guid: 'guid',
      name: 'name',
      username: 'username',
      icontime: 11111,
      subscribers_count: 182,
      impressions: 18200,
      pinned_posts: ['a', 'b', 'c']
    };

    clientMock.response[`api/v1/subscribe/subscribers/guid`] = {
      'status': 'success',
      'users': [{}, {}, {}]
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
    tick();
    fixture.detectChanges();

    expect(comp.users.length).toBe(3);
    expect(fixture.debugElement.queryAll(By.css('minds-card-user')).length).toBe(3);
    expect(clientMock.get.calls.mostRecent().args[0]).toEqual('api/v1/subscribe/subscribers/guid');
  }));

  it('should have an infinite-scroll', () => {
    expect(fixture.debugElement.query(By.css('infinite-scroll'))).toBeTruthy();
  });

});
