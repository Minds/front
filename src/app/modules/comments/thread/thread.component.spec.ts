/**
 * @author Ben Hayward
 * @desc Spec tests for the thread component
 */
import {
  ComponentFixture,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { CommentsThreadComponent } from './thread.component';
import { clientMock } from '../../../../tests/client-mock.spec';
import { fakeAsync } from '@angular/core/testing';
import { sessionMock } from '../../../../tests/session-mock.spec';
import { MockService, MockComponent } from '../../../utils/mock';
import { CommentsScrollDirective } from '../scroll';
import { CommentsService } from '../comments.service';
import { BlockListService } from '../../../common/services/block-list.service';
import { RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { Client } from '../../../services/api';
import { Session } from '../../../services/session';
import { SocketsService } from '../../../services/sockets';
import { ActivityService } from '../../../common/services/activity.service';
import { By } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { LoadingSpinnerComponent } from '../../../common/components/loading-spinner/loading-spinner.component';

let commentsServiceMock: any = MockService(CommentsService, {
  get: Promise.resolve(true),
});

xdescribe('CommentsThreadComponent', () => {
  let comp: CommentsThreadComponent;
  let fixture: ComponentFixture<CommentsThreadComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          MockComponent({
            selector: 'm-comment__poster',
            inputs: [
              'guid',
              'routerLink',
              'parent',
              'entity',
              'currentIndex',
              'conversation',
              'level',
            ],
          }),
          MockComponent({
            selector: 'm-comment',
            inputs: [
              'comment',
              'entity',
              'parent',
              'level',
              'canEdit',
              'canDelete',
              'showReplies',
            ],
            outputs: ['emitter', 'enabled'],
          }),
          CommentsThreadComponent,
          CommentsScrollDirective,
          LoadingSpinnerComponent,
        ],
        imports: [
          RouterModule.forRoot([], { relativeLinkResolution: 'legacy' }),
          HttpClientTestingModule,
          HttpClientModule,
        ],
        providers: [
          { provide: Client, useValue: clientMock },
          { provide: Session, useValue: sessionMock },
          {
            provide: BlockListService,
            useValue: MockService(BlockListService),
          },
          { provide: CommentsService, useValue: commentsServiceMock },
          { provide: SocketsService, useValue: MockService(SocketsService) },
          { provide: ActivityService, useValue: MockService(ActivityService) },
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 9999;
    jasmine.clock().uninstall();
    jasmine.clock().install();

    fixture = TestBed.createComponent(CommentsThreadComponent);

    comp = fixture.componentInstance;

    comp.parent = {
      child_path: '',
      parent_path: '',
    };
    comp.scrollView = {
      nativeElement: {
        scrollHeight: 1,
        scrollTop: 1,
      },
    };
    comp.entity = {
      guid: 1,
      entity_guid: 1,
    };
    comp.level = 1;

    comp.activityService.allowComment$ = new BehaviorSubject<boolean>(true);
    comp.sockets.error$ = new BehaviorSubject<boolean>(false);

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

  it('should be instantiated', () => {
    expect(comp).toBeTruthy();
  });

  it('should show message to user on socket connection error', fakeAsync(() => {
    comp.sockets.error$.next(true);
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(
        fixture.debugElement.query(By.css('.m-commentsThread__connectionLost'))
      ).not.toBeNull();
    });
  }));

  it('should allow a user to retry on socket connection error', fakeAsync(() => {
    let retry = () =>
      fixture.debugElement.query(
        By.css('.m-commentsThread__connectionLost--retry')
      );

    comp.sockets.error$.next(true);
    comp.inProgress = false;

    fixture.detectChanges();

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(retry()).not.toBeNull();
      retry().nativeElement.click();
      tick(1000);

      fixture.detectChanges();
      expect(retry()).toBeNull();
      tick(2000);
    });
  }));

  it('should not show message to user when no error from sockets', () => {
    comp.sockets.error$.next(false);
    fixture.detectChanges();
    expect(
      fixture.debugElement.query(By.css('.m-commentsThread__connectionLost'))
    ).toBeNull();
  });
});
