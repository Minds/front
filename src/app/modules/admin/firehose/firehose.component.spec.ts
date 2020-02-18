import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { Component, Input, Output } from '@angular/core';
import { sessionMock } from '../../../../tests/session-mock.spec';
import { Client } from '../../../services/api/client';
import { By } from '@angular/platform-browser';
import { clientMock } from '../../../../tests/client-mock.spec';
import { AdminFirehoseComponent } from './firehose.component';
import { Session } from '../../../services/session';
import { RouterTestingModule } from '@angular/router/testing';
import { NewsfeedHashtagSelectorService } from '../../newsfeed/services/newsfeed-hashtag-selector.service';
import { newsfeedHashtagSelectorServiceMock } from '../../../../tests/newsfeed-hashtag-selector-service-mock.spec';
import { overlayModalServiceMock } from '../../../../tests/overlay-modal-service-mock.spec';
import { activityServiceMock } from '../../../../tests/activity-service-mock.spec';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { EventEmitter } from '@angular/core';
import { ActivityService } from '../../../common/services/activity.service';

@Component({
  selector: 'minds-activity',
  template: '',
})
class MindsActivityMockComponent {
  @Input() object: any;
}

@Component({
  selector: 'm-sort-selector',
  template: '',
})
class MindsSortSelectorMockComponent {
  @Input() algorithm: string;
  @Input() period: string;
  @Input() allowedCustomTypes: Array<string>;
  @Output() onChange: EventEmitter<any> = new EventEmitter<any>();
}

describe('AdminFirehose', () => {
  let comp: AdminFirehoseComponent;
  let fixture: ComponentFixture<AdminFirehoseComponent>;

  function getMockActivities() {
    return [
      {
        guid: 1,
      },
      {
        guid: 2,
      },
      {
        guid: 3,
      },
    ];
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MindsActivityMockComponent,
        AdminFirehoseComponent,
        MindsSortSelectorMockComponent,
      ],
      imports: [RouterTestingModule],
      providers: [
        { provide: Session, useValue: sessionMock },
        { provide: Client, useValue: clientMock },
        {
          provide: NewsfeedHashtagSelectorService,
          useValue: newsfeedHashtagSelectorServiceMock,
        },
        { provide: OverlayModalService, useValue: overlayModalServiceMock },
        { provide: ActivityService, useValue: activityServiceMock },
      ],
    }).compileComponents();
  }));

  beforeEach(done => {
    fixture = TestBed.createComponent(AdminFirehoseComponent);

    comp = fixture.componentInstance;
    comp.entities = getMockActivities();

    fixture.detectChanges();

    clientMock.response = {};
    clientMock.response[
      `api/v2/admin/firehose/latest/activities?hashtags=&period=12h&all=`
    ] = {
      status: 'success',
      entities: getMockActivities(),
    };

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        done();
      });
    }
  });

  it('should have a loading screen', () => {
    comp.inProgress = true;
    fixture.detectChanges();
    expect(
      fixture.debugElement.query(By.css('.m-firehose__spinner'))
    ).not.toBeNull();
  });

  it('should hide a loading screen', () => {
    comp.inProgress = false;
    fixture.detectChanges();
    expect(
      fixture.debugElement.query(By.css('.m-firehose__spinner'))
    ).toBeNull();
  });

  it('should initialize entities', () => {
    comp.entities = getMockActivities();
    expect(comp.entities.length).toEqual(3);
    expect(comp.entities).not.toBeNull();
    comp.initializeEntity();
    expect(comp.entity).toEqual(getMockActivities()[0]);
    expect(comp.entities.length).toEqual(2);
  });

  it('should save an accept activity', fakeAsync(() => {
    clientMock.response['api/v2/admin/firehose/1'] = { status: 'success' };
    comp.save(getMockActivities()[0].guid);
    fixture.detectChanges();
    tick();
    expect(clientMock.post).toHaveBeenCalled();
    expect(clientMock.post.calls.mostRecent().args[0]).toContain(
      'api/v2/admin/firehose/1'
    );
  }));

  it('should save a reported activity', fakeAsync(() => {
    clientMock.response['api/v2/admin/firehose/1'] = { status: 'success' };
    comp.save(getMockActivities()[0].guid, 1, 1);
    fixture.detectChanges();
    tick();
    expect(clientMock.post).toHaveBeenCalled();
    expect(clientMock.post.calls.mostRecent().args[0]).toContain(
      'api/v2/admin/firehose/1'
    );
    expect(clientMock.post.calls.mostRecent().args[1]).toEqual({
      reason: 1,
      subreason: 1,
    });
  }));

  it('should accept an activity', fakeAsync(() => {
    spyOn(comp, 'save');
    spyOn(comp, 'initializeEntity');
    comp.accept();
    expect(clientMock.post).toHaveBeenCalled();
    expect(clientMock.post.calls.mostRecent().args[0]).toContain(
      'api/v2/admin/firehose/1'
    );
    expect(comp.save).toHaveBeenCalled();
    expect(comp.initializeEntity).toHaveBeenCalled();
  }));

  it('should swipe left', fakeAsync(() => {
    spyOn(comp, 'reject').and.callThrough();
    comp.onKeyPress({ key: 'ArrowLeft' });
    expect(comp.reject).toHaveBeenCalled();
  }));

  it('should swipe right', fakeAsync(() => {
    spyOn(comp, 'accept').and.callThrough();
    comp.onKeyPress({ key: 'ArrowRight' });
    expect(comp.accept).toHaveBeenCalled();
  }));
});
