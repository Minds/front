import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ChatRequestListComponent } from './request-list.component';
import { MockComponent, MockService } from '../../../../utils/mock';
import { CommonModule as NgCommonModule } from '@angular/common';
import { ChatRequestsListService } from '../../services/chat-requests-list.service';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterEvent,
  convertToParamMap,
} from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { PageInfo } from '../../../../../graphql/generated.engine';

const ROOM_ID: string = '1234567890';

describe('ChatRequestListComponent', () => {
  let comp: ChatRequestListComponent;
  let fixture: ComponentFixture<ChatRequestListComponent>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      imports: [ChatRequestListComponent],
      providers: [
        {
          provide: ChatRequestsListService,
          useValue: MockService(ChatRequestsListService, {
            has: ['pageInfo$'],
            props: {
              pageInfo$: {
                get: () =>
                  new BehaviorSubject<PageInfo>({
                    hasNextPage: true,
                    hasPreviousPage: false,
                    endCursor: 'endCursor',
                    startCursor: 'startCursor',
                  }),
              },
            },
          }),
        },
        {
          provide: ActivatedRoute,
          useValue: MockService(ActivatedRoute, {
            has: ['snapshot'],
            props: {
              snapshot: {
                get: () => {
                  return {
                    firstChild: {
                      params: convertToParamMap({ roomId: ROOM_ID }),
                    },
                  };
                },
              },
            },
          }),
        },
        {
          provide: Router,
          useValue: MockService(Router, {
            has: ['events'],
            props: {
              events: {
                get: () => {
                  return new BehaviorSubject<RouterEvent>(null);
                },
              },
            },
          }),
        },
      ],
    }).overrideComponent(ChatRequestListComponent, {
      set: {
        imports: [
          NgCommonModule,
          MockComponent({
            selector: 'm-chat__roomListItem',
            inputs: ['edge', 'active', 'navigationLink'],
            standalone: true,
          }),
          MockComponent({
            selector: 'infinite-scroll',
            inputs: [
              'moreData',
              'inProgress',
              'hideManual',
              'distance',
              'scrollSource',
            ],
            outputs: ['load'],
            standalone: true,
          }),
          MockComponent({
            selector: 'm-loadingSpinner',
            inputs: ['inProgress'],
            standalone: true,
          }),
        ],
      },
    });

    fixture = TestBed.createComponent(ChatRequestListComponent);
    comp = fixture.componentInstance;
    (comp as any).route.snapshot.firstChild.params['roomId'] = ROOM_ID;

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

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  it('should set current room ID on navigation end', fakeAsync(() => {
    (comp as any).currentRoomId$.next('');
    (comp as any).router.events.next(new NavigationEnd(1, '/', '/'));

    tick();

    expect((comp as any).currentRoomId$.getValue()).toBe(ROOM_ID);
  }));

  it('should fetch more', () => {
    (comp as any).fetchMore();
    expect((comp as any).chatRequestsListService.fetchMore).toHaveBeenCalled();
  });

  it('should get edge id as track by key', () => {
    const key: string = '123';
    expect((comp as any).trackBy({ node: { id: key } })).toBe(key);
  });

  it('should handle back icon click', () => {
    (comp as any).onBackIconClick();
    expect((comp as any).router.navigateByUrl).toHaveBeenCalledWith(
      '/chat/rooms'
    );
  });
});
