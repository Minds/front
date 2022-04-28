import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { FeedNoticeOutletComponent } from './feed-notice-outlet.component';
import { MockComponent, MockService } from '../../../utils/mock';
import { RouterTestingModule } from '@angular/router/testing';
import { FeedNoticeService } from '../services/feed-notice.service';
import { BehaviorSubject } from 'rxjs';

describe('FeedNoticeOutletComponent', () => {
  let comp: FeedNoticeOutletComponent;
  let fixture: ComponentFixture<FeedNoticeOutletComponent>;

  const updatedState$ = new BehaviorSubject<boolean>(false);

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule],
        declarations: [
          FeedNoticeOutletComponent,
          MockComponent({ selector: 'm-feedNotice--verifyEmail' }),
          MockComponent({ selector: 'm-feedNotice--buildYourAlgorithm' }),
          MockComponent({ selector: 'm-feedNotice--enablePushNotifications' }),
        ],
        providers: [
          {
            provide: FeedNoticeService,
            useValue: MockService(FeedNoticeService, {
              has: ['updatedState$'],
              props: {
                updatedState$: { get: () => updatedState$ },
              },
            }),
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(FeedNoticeOutletComponent);
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

  it('should instantiate', () => {
    expect(comp).toBeTruthy();
  });

  it('should get next next notice when not in showMultiple mode if one has not already been shown', fakeAsync(() => {
    const notice = 'build-your-algorithm';

    (comp as any).showMultiple = false;
    (comp as any).service.getNextShowableNotice.and.returnValue(notice);
    (comp as any).service.hasShownANotice.and.returnValue(false);

    (comp as any).initSubscription();
    (comp as any).service.updatedState$.next(true);
    tick();

    expect((comp as any).service.getNextShowableNotice).toHaveBeenCalled();
    expect((comp as any).service.hasShownANotice).toHaveBeenCalled();
    expect((comp as any).activeNotice).toBe(notice);
    expect((comp as any).service.setShown).toHaveBeenCalledWith(notice, true);
  }));

  it('should get next showable notice when one has already shown, in showMultiple mode', fakeAsync(() => {
    const notice = 'build-your-algorithm';
    const position = 'top';

    (comp as any).position = position;
    (comp as any).showMultiple = true;
    (comp as any).service.getNextShowableNotice.and.returnValue(notice);
    (comp as any).service.hasShownANotice.and.returnValue(notice);

    (comp as any).initSubscription();
    (comp as any).service.updatedState$.next(true);
    tick();

    expect((comp as any).service.getNextShowableNotice).toHaveBeenCalledWith(
      position
    );
    expect((comp as any).activeNotice).toBe(notice);
    expect((comp as any).service.setShown).toHaveBeenCalledWith(notice, true);
  }));
});
