import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FeedNoticeOutletComponent } from './feed-notice-outlet.component';
import { MockComponent, MockService } from '../../../utils/mock';
import { RouterTestingModule } from '@angular/router/testing';
import { FeedNoticeService } from '../services/feed-notice.service';
import { BehaviorSubject, of } from 'rxjs';
import { NoticeKey, NoticeLocation } from '../feed-notice.types';

describe('FeedNoticeOutletComponent', () => {
  let comp: FeedNoticeOutletComponent;
  let fixture: ComponentFixture<FeedNoticeOutletComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule],
        declarations: [
          FeedNoticeOutletComponent,
          MockComponent({ selector: 'm-feedNotice--verifyEmail' }),
          MockComponent({ selector: 'm-feedNotice--buildYourAlgorithm' }),
          MockComponent({ selector: 'm-feedNotice--enablePushNotifications' }),
          MockComponent({ selector: 'm-feedNotice--updateTags' }),
        ],
        providers: [
          {
            provide: FeedNoticeService,
            useValue: MockService(FeedNoticeService, {
              has: ['initialized$'],
              props: {
                initialized$: {
                  get: () => new BehaviorSubject<boolean>(false),
                },
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

  it('should set next notice', () => {
    const notice = {
      key: 'verify-email' as NoticeKey,
      location: 'top' as NoticeLocation,
      should_show: true,
      dismissed: false,
      position: -1,
    };

    (comp as any).service.initialized$.next(true);
    (comp as any).service.register.and.returnValue(-1);
    (comp as any).service.getNoticeForPosition$.and.returnValue(of(notice));
    (comp as any).service.shouldBeStickyTop.and.returnValue(true);

    comp.ngOnInit();

    expect((comp as any).service.register).toHaveBeenCalledWith('top');
    expect((comp as any).service.getNoticeForPosition$).toHaveBeenCalledWith(
      -1
    );
    expect((comp as any).service.shouldBeStickyTop).toHaveBeenCalledWith(
      notice
    );
    expect(comp.notice$.getValue()).toEqual(notice);
  });
});
