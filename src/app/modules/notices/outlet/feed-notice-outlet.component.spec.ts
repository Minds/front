import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FeedNoticeOutletComponent } from './feed-notice-outlet.component';
import { MockComponent, MockService } from '../../../utils/mock';
import { RouterTestingModule } from '@angular/router/testing';
import { FeedNoticeService } from '../services/feed-notice.service';

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
        ],
        providers: [
          {
            provide: FeedNoticeService,
            useValue: MockService(FeedNoticeService),
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

  it('should get next uncompleted notice when not showing multiple', () => {
    const notice = 'build-your-algorithm';

    (comp as any).showMultiple = false;
    (comp as any).service.getNextUncompletedNotice.and.returnValue(notice);
    (comp as any).service.shouldShowInPosition.and.returnValue(true);

    (comp as any).initNotice();

    expect((comp as any).service.getNextUncompletedNotice).toHaveBeenCalled();
    expect((comp as any).service.shouldShowInPosition(notice, 'top'));
    expect((comp as any).activeNotice).toBe(notice);
    expect((comp as any).service.setShown).toHaveBeenCalledWith(notice, true);
  });

  it('should get next showable notice when showing multiple', () => {
    const notice = 'build-your-algorithm';
    const position = 'top';

    (comp as any).position = position;
    (comp as any).showMultiple = true;
    (comp as any).service.getNextShowableNotice.and.returnValue(notice);
    (comp as any).service.shouldShowInPosition.and.returnValue(true);

    (comp as any).initNotice();

    expect((comp as any).service.getNextShowableNotice).toHaveBeenCalledWith(
      position
    );
    expect((comp as any).service.shouldShowInPosition(notice, position));
    expect((comp as any).activeNotice).toBe(notice);
    expect((comp as any).service.setShown).toHaveBeenCalledWith(notice, true);
  });

  it('should get next showable notice, but not show it if it should not show in this position', () => {
    const notice = 'build-your-algorithm';
    const position = 'top';

    (comp as any).position = position;
    (comp as any).showMultiple = true;
    (comp as any).service.getNextShowableNotice.and.returnValue(notice);
    (comp as any).service.shouldShowInPosition.and.returnValue(false);

    (comp as any).initNotice();

    expect((comp as any).service.getNextShowableNotice).toHaveBeenCalledWith(
      position
    );
    expect((comp as any).service.shouldShowInPosition(notice, position));
    expect((comp as any).activeNotice).toBeNull();
    expect((comp as any).service.setShown).not.toHaveBeenCalledWith(
      notice,
      true
    );
  });

  it('should determine notice is to be shown if it matches the activeNotice and it is not dismissed', () => {
    const notice = 'build-your-algorithm';

    comp.activeNotice = notice;
    (comp as any).service.isDismissed.and.returnValue(false);

    expect(comp.shouldShowNotice(notice)).toBeTruthy();
  });

  it('should determine notice is NOT to be shown if it matches the activeNotice and it IS dismissed', () => {
    const notice = 'build-your-algorithm';

    comp.activeNotice = notice;
    (comp as any).service.isDismissed.and.returnValue(true);

    expect(comp.shouldShowNotice(notice)).toBeFalsy();
  });

  it('should determine notice is NOT to be shown if it does NOT match the activeNotice', () => {
    const notice = 'build-your-algorithm';

    comp.activeNotice = 'enable-push-notifications';
    (comp as any).service.isDismissed.and.returnValue(false);

    expect(comp.shouldShowNotice(notice)).toBeFalsy();
  });
});
