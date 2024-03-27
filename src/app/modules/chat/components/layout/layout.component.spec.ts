import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ChatPageLayoutComponent } from './layout.component';
import { MockService } from '../../../../utils/mock';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterEvent,
} from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { TopbarAlertService } from '../../../../common/components/topbar-alert/topbar-alert.service';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';

describe('ChatPageLayoutComponent', () => {
  let comp: ChatPageLayoutComponent;
  let fixture: ComponentFixture<ChatPageLayoutComponent>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      imports: [ChatPageLayoutComponent, RouterTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { firstChild: { data: { fullWidthOnly: false } } },
          },
        },
        {
          provide: Router,
          useValue: {
            events: new BehaviorSubject<RouterEvent>(null),
          },
        },
        {
          provide: TopbarAlertService,
          useValue: MockService(TopbarAlertService, {
            has: ['shouldShow$'],
            props: {
              shouldShow$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
            },
          }),
        },
        BreakpointObserver,
      ],
    });

    fixture = TestBed.createComponent(ChatPageLayoutComponent);
    comp = fixture.componentInstance;

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

  it('should set full width only child route to FALSE when router indicates that this is correct', fakeAsync(() => {
    (comp as any).fullWidthOnlyChildRoute$.next(true);
    (comp as any).route.snapshot.firstChild.data.fullWidthOnly = false;
    (comp as any).router.events.next(
      new NavigationEnd(
        0,
        'http://example.minds.com/chat/rooms',
        'http://example.minds.com/chat/rooms'
      )
    );

    tick();

    expect((comp as any).fullWidthOnlyChildRoute$.getValue()).toBe(false);
  }));

  it('should set full width only child route to TRUE when router indicates that this is correct', fakeAsync(() => {
    (comp as any).fullWidthOnlyChildRoute$.next(false);
    (comp as any).route.snapshot.firstChild.data.fullWidthOnly = true;
    (comp as any).router.events.next(
      new NavigationEnd(
        0,
        'http://example.minds.com/chat/rooms',
        'http://example.minds.com/chat/rooms'
      )
    );

    tick();

    expect((comp as any).fullWidthOnlyChildRoute$.getValue()).toBe(true);
  }));
});
