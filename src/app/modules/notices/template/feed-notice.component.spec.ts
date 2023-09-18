import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { FeedNoticeComponent } from './feed-notice.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MockService } from '../../../utils/mock';
import { ElementRef } from '@angular/core';
import { AnalyticsService } from '../../../services/analytics';
import { Subject } from 'rxjs';
import { IntersectionObserverService } from '../../../common/services/intersection-observer.service';

let intersectionObserverServiceMock = new (function() {
  this.subject$ = new Subject<boolean>();
  this.createAndObserve = jasmine
    .createSpy('createAndObserve')
    .and.returnValue(this.subject$);
})();

describe('FeedNoticeComponent', () => {
  let comp: FeedNoticeComponent;
  let fixture: ComponentFixture<FeedNoticeComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule],
        declarations: [FeedNoticeComponent],
        providers: [
          {
            provide: ElementRef,
            useValue: MockService(ElementRef),
          },
          {
            provide: AnalyticsService,
            useValue: MockService(AnalyticsService),
          },
          {
            provide: IntersectionObserverService,
            useValue: intersectionObserverServiceMock,
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(FeedNoticeComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();

    (comp as any).analytics.trackView.calls.reset();

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
    comp.ngOnDestroy();
  });

  it('should instantiate', () => {
    expect(comp).toBeTruthy();
  });

  it('should it should register IntersectionObserver on init', () => {
    comp.ngOnInit();
    expect(
      (comp as any).intersectionObserver.createAndObserve
    ).toHaveBeenCalled();
    expect((comp as any).analytics.trackView).not.toHaveBeenCalled();
  });

  it('should track an analytics view when intersection observer subscription emits true and data ref is undefined', fakeAsync(() => {
    (comp as any).intersectionObserver.subject$.next(true);
    tick(1000);
    expect((comp as any).analytics.trackView).toHaveBeenCalledOnceWith(
      'feed-notice-unknown'
    );
  }));

  it('should track an analytics view when intersection observer subscription emits true and data ref is defined', fakeAsync(() => {
    comp.dataRefId = 'bya';
    (comp as any).intersectionObserver.subject$.next(true);
    tick(1000);
    expect((comp as any).analytics.trackView).toHaveBeenCalledOnceWith(
      'feed-notice-bya'
    );
  }));

  it('should NOT track an analytics view when intersection observer subscription emits false', fakeAsync(() => {
    (comp as any).intersectionObserver.subject$.next(false);
    tick(1000);
    expect((comp as any).analytics.trackView).not.toHaveBeenCalled();
  }));
});
