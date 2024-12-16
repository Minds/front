/**
 * @author Ben Hayward
 * @desc Spec tests for the thread component
 */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CommentsThreadComponent } from './thread.component';
import { clientMock } from '../../../../tests/client-mock.spec';
import { sessionMock } from '../../../../tests/session-mock.spec';
import { MockService, MockComponent } from '../../../utils/mock';
import { CommentsScrollDirective } from '../scroll';
import { CommentsService } from '../comments.service';
import { BlockListService } from '../../../common/services/block-list.service';
import { RouterModule } from '@angular/router';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { Client } from '../../../services/api';
import { Session } from '../../../services/session';
import { SocketsService } from '../../../services/sockets';
import { ActivityService } from '../../../common/services/activity.service';
import { BehaviorSubject } from 'rxjs';
import { LoadingSpinnerComponent } from '../../../common/components/loading-spinner/loading-spinner.component';
import { PermissionIntentsService } from '../../../common/services/permission-intents.service';
import { PermissionsEnum } from '../../../../graphql/generated.engine';

let commentsServiceMock: any = MockService(CommentsService, {
  get: Promise.resolve(true),
});

describe('CommentsThreadComponent', () => {
  let comp: CommentsThreadComponent;
  let fixture: ComponentFixture<CommentsThreadComponent>;

  beforeEach(waitForAsync(() => {
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
            'readonly',
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
      imports: [RouterModule.forRoot([], {})],
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
        {
          provide: PermissionIntentsService,
          useValue: MockService(PermissionIntentsService),
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
  }));

  beforeEach((done) => {
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

  it('should instantiate and set shouldHideCommentPoster appropriately', () => {
    (comp as any).shouldHideCommentPoster = false;

    (comp as any).permissionIntentsService.shouldHide
      .withArgs(PermissionsEnum.CanComment)
      .and.returnValue(true);
    comp.ngOnInit();
    expect((comp as any).shouldHideCommentPoster).toBeTrue();

    (comp as any).permissionIntentsService.shouldHide
      .withArgs(PermissionsEnum.CanComment)
      .and.returnValue(false);
    comp.ngOnInit();
    expect((comp as any).shouldHideCommentPoster).toBeFalse();
  });
});
