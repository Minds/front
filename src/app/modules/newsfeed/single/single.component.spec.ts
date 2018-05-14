import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Component, DebugElement, Input } from '@angular/core';

import { NewsfeedSingleComponent } from './single.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Client } from '../../../services/api/client';
import { By } from '@angular/platform-browser';
import { Session } from '../../../services/session';
import { clientMock } from '../../../../tests/client-mock.spec';
import { MaterialMock } from '../../../../tests/material-mock.spec';
import { sessionMock } from '../../../../tests/session-mock.spec';
import { uploadMock } from '../../../../tests/upload-mock.spec';
import { Upload } from '../../../services/api/upload';
import { ContextService } from '../../../services/context.service';
import { contextServiceMock } from '../../../../tests/context-service-mock.spec';
import { of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'minds-activity',
  template: ''
})
class MindsActivityMock {
  @Input() object: any;
  @Input() commentsToggle: boolean;
  @Input() showRatingToggle: boolean;
}

let routerMock = new function () {
  this.navigate = jasmine.createSpy('navigate').and.stub();
};

describe('NewsfeedSingleComponent', () => {

  let comp: NewsfeedSingleComponent;
  let fixture: ComponentFixture<NewsfeedSingleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MaterialMock, MindsActivityMock, NewsfeedSingleComponent], // declare the test component
      imports: [RouterTestingModule, ReactiveFormsModule],
      providers: [
        { provide: Session, useValue: sessionMock },
        { provide: Client, useValue: clientMock },
        { provide: Upload, useValue: uploadMock },
        { provide: ContextService, useValue: contextServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ guid: 123 })
          }
        },
        { provide: Router, useValue: routerMock }
      ]
    })
      .compileComponents();  // compile template and css
  }));

  // synchronous beforeEach
  beforeEach((done) => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();
    fixture = TestBed.createComponent(NewsfeedSingleComponent);

    comp = fixture.componentInstance; // NewsfeedSingleComponent test instance

    clientMock.response = {};

    clientMock.response['api/v1/newsfeed/single/123'] = {
      'status': 'success',
      "activity": {
        "guid": "123",
        "type": "activity",
        "time_created": "1525415052",
        "time_updated": "1525415052",
        "container_guid": "1234",
        "owner_guid": "1234",
        "access_id": "2",
        "message": "i'm a message",
        "ownerObj": {},
      }
    };

    sessionMock.user.admin = false;

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

  it("should have loaded the activity on component's init", () => {
    expect(clientMock.get).toHaveBeenCalled();
    expect(clientMock.get.calls.mostRecent().args[0]).toBe('api/v1/newsfeed/single/123');
  });

  it("should show an error message together with mind's logo when there's an error", () => {
    comp.error = 'error';
    comp.inProgress = false;
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.m-error-splash'))).not.toBeNull();
    expect(fixture.debugElement.query(By.css('.m-error-splash img'))).not.toBeNull();

    const h3 = fixture.debugElement.query(By.css('.m-error-splash h3'));
    expect(h3).not.toBeNull();
    expect(h3.nativeElement.textContent).toContain('error');

    const span = fixture.debugElement.query(By.css('.m-error-splash span'));
    expect(span).not.toBeNull();
    expect(span.nativeElement.textContent).toContain('Please try again later');
  });

  it('it should show the activity', () => {
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.minds-list minds-activity'))).not.toBeNull();
  });

  it('it should show a spam notice if the activity was marked as spam', () => {
    comp.activity.spam = true;

    fixture.detectChanges();

    const spamNotice =fixture.debugElement.query(By.css('.m--spam-notice'));
    expect(spamNotice).not.toBeNull();
    expect(spamNotice.nativeElement.textContent).toContain('This activity is flagged as spam.');
    expect(spamNotice.nativeElement.textContent).toContain('If you wish to appeal, please contact us at info@minds.com.');
  });

  it('it should not show the appeal text if the user is an admin', () => {
    comp.activity.spam = true;
    sessionMock.user.admin = true;

    fixture.detectChanges();

    const spamNotice =fixture.debugElement.query(By.css('.m--spam-notice'));
    expect(spamNotice).not.toBeNull();
    expect(spamNotice.nativeElement.textContent).toContain('This activity is flagged as spam.');
    expect(spamNotice.nativeElement.textContent).not.toContain('If you wish to appeal, please contact us at info@minds.com.');
  });

});
