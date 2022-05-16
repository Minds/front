///<reference path="../../../../../node_modules/@types/jasmine/index.d.ts"/>
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import {
  Component,
  DebugElement,
  EventEmitter,
  Input,
  Output,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ReportConsoleComponent } from './console.component';
import { Client } from '../../../services/api/client';
import { By } from '@angular/platform-browser';
import { clientMock } from '../../../../tests/client-mock.spec';
import { scrollServiceMock } from '../../../../tests/scroll-service-mock.spec';
import { MaterialMock } from '../../../../tests/material-mock.spec';
import { InfiniteScrollMock } from '../../../../tests/infinite-scroll-mock.spec';
import { MindsCardMock } from '../../../../tests/minds-card-mock.spec';
import { MindsCardCommentMock } from '../../../../tests/minds-card-comment-mock.spec';
import { FormsModule } from '@angular/forms';
import { ScrollService } from '../../../services/ux/scroll';
import {
  $it,
  $beforeAll,
  $beforeEach,
  $afterEach,
  $afterAll,
} from 'jasmine-ts-async';
import { JurySessionService } from '../juryduty/session/session.service';
import { FormToastService } from '../../../common/services/form-toast.service';
import { MockService } from '../../../utils/mock';
/* tslint:disable */
describe('ReportConsoleComponent', () => {
  let comp: ReportConsoleComponent;
  let fixture: ComponentFixture<ReportConsoleComponent>;
  let appeals: Array<any>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          MaterialMock,
          InfiniteScrollMock,
          MindsCardMock,
          MindsCardCommentMock,
          ReportConsoleComponent,
        ], // declare the test component
        imports: [FormsModule, RouterTestingModule],
        providers: [
          { provide: Client, useValue: clientMock },
          JurySessionService,
          {
            provide: FormToastService,
            useValue: MockService(FormToastService),
          },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents(); // compile template and css
    })
  );

  // synchronous beforeEach
  beforeEach(done => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();
    fixture = TestBed.createComponent(ReportConsoleComponent);
    clientMock.response = {};
    fixture.detectChanges();
    comp = fixture.componentInstance;
    appeals = [];
    clientMock.response[`api/v2/moderation/appeals/review`] = {
      status: 'success',
      'load-next': '',
      appeals: [
        {
          report: {
            guid: '756593195889987599',
            entity_guid: '755121974073626627',
            entity: { type: 'comment' },
          },
        },
        {
          report: {
            guid: '756593195889987599',
            entity_guid: '755121974073626627',
            entity: { type: 'comment' },
          },
        },
        {
          report: {
            guid: '756593195889987599',
            entity_guid: '755121974073626627',
            entity: { type: 'comment' },
          },
        },
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

  it('should have 5 tabs', fakeAsync(() => {
    const tabs = fixture.debugElement.queryAll(
      By.css('.m-report-console--tabs .mdl-tabs__tab')
    );
    expect(tabs.length).toBe(5);
  }));

  it('should load appeal textarea if filter is review', fakeAsync(() => {
    const tabs = fixture.debugElement.queryAll(By.css('#appealContent'));
    expect(tabs).not.toBeNull();
  }));

  it('should load appeals', fakeAsync(() => {
    comp.load();
    tick();
    expect(clientMock.get.calls.mostRecent().args[1]).toEqual({
      limit: 12,
      offset: '',
    });
    expect(comp.appeals.length).toBe(3);
    fixture.detectChanges();
    const items = fixture.debugElement.queryAll(By.css('m-moderation__appeal'));
    expect(items.length).toBe(3);
  }));

  it('should load appeals, and refresh', fakeAsync(() => {
    comp.load();
    tick();
    expect(clientMock.get.calls.mostRecent().args[1]).toEqual({
      limit: 12,
      offset: '',
    });
    expect(comp.appeals.length).toBe(3);
    comp.load(true);
    tick();
    expect(clientMock.get.calls.mostRecent().args[1]).toEqual({
      limit: 12,
      offset: '',
    });
    expect(comp.appeals.length).toBe(3);
  }));
});
