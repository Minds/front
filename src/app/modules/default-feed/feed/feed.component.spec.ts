import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DefaultFeedComponent } from './feed.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MockComponent, MockService } from '../../../utils/mock';
import { FeedsService } from '../../../common/services/feeds.service';
import { By } from '@angular/platform-browser';
import { ExperimentsService } from '../../experiments/experiments.service';
import { BehaviorSubject, of } from 'rxjs';
import { DismissalService } from '../../../common/services/dismissal.service';
import { FeedNoticeService } from '../../notices/services/feed-notice.service';
import { Session } from '../../../services/session';

describe('DefaultFeedComponent', () => {
  let comp: DefaultFeedComponent;
  let fixture: ComponentFixture<DefaultFeedComponent>;

  let feedsServiceMock = {
    canFetchMore: true,
    inProgress: new BehaviorSubject(false),
    offset: new BehaviorSubject<number>(0),
    feed: new BehaviorSubject(Array(25).fill(of({}))),
    clear() {
      of({ response: false }, { response: false }, { response: true });
    },
    response() {
      return { response: true };
    },
    setEndpoint(str) {
      return this;
    }, //chainable
    setLimit(limit) {
      return this;
    },
    setParams(params) {
      return this;
    },
    setUnseen(params) {
      return this;
    },
    fetch() {
      return this;
    },
    loadMore() {
      return this;
    },
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.overrideComponent(DefaultFeedComponent, {
        set: {
          providers: [{ provide: FeedsService, useValue: feedsServiceMock }],
        },
      }); // https://medium.com/ngconf/how-to-override-component-providers-in-angular-unit-tests-b73b47b582e3
      TestBed.configureTestingModule({
        declarations: [
          MockComponent({
            selector: 'm-activity',
            inputs: ['entity', 'displayOptions', 'slot'],
          }),
          MockComponent({
            selector: 'infinite-scroll',
            inputs: ['moreData', 'inProgress'],
            outputs: ['load'],
          }),
          MockComponent({
            selector: 'm-feedNotice__outlet',
            inputs: ['location'],
          }),
          DefaultFeedComponent,
        ],
        imports: [RouterTestingModule, ReactiveFormsModule],
        providers: [
          {
            provide: ExperimentsService,
            useValue: MockService(ExperimentsService),
          },
          {
            provide: FeedNoticeService,
            useValue: MockService(FeedNoticeService),
          },
          {
            provide: DismissalService,
            useValue: MockService(DismissalService),
          },
          {
            provide: Session,
            useValue: MockService(Session),
          },
        ],
      })
        .overrideProvider(FeedsService, {
          useValue: feedsServiceMock,
        })
        .compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(DefaultFeedComponent);

    comp = fixture.componentInstance;

    (comp as any).session.isLoggedIn.and.returnValue(true);

    fixture.detectChanges();

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        done();
      });
    }
  });

  it('should initialize', () => {
    expect(comp).toBeTruthy();
    expect((comp as any).feedNoticeService.fetch).toHaveBeenCalled();
  });

  it('should have loaded an activity', () => {
    expect(By.css('m-activity')).toBeDefined();
  });

  it('should have an infinite scroll component', () => {
    expect(By.css('infinite-scroll')).toBeDefined();
  });

  it('should load', () => {
    spyOn(comp.feedsService, 'setEndpoint').and.returnValue(comp.feedsService);
    spyOn(comp.feedsService, 'setLimit').and.returnValue(comp.feedsService);
    spyOn(comp.feedsService, 'setUnseen').and.returnValue(comp.feedsService);
    spyOn(comp.feedsService, 'fetch');

    (comp as any).load();

    expect(comp.feedsService.setEndpoint).toHaveBeenCalledWith(
      'api/v3/newsfeed/default-feed'
    );
    expect(comp.feedsService.setLimit).toHaveBeenCalledWith(12);
    expect(comp.feedsService.fetch).toHaveBeenCalledWith(false);
  });

  it('should call to load more', () => {
    comp.feedsService.canFetchMore = true;
    comp.feedsService.inProgress.next(false);
    comp.feedsService.offset.next(12);

    spyOn(comp.feedsService, 'fetch');
    spyOn(comp.feedsService, 'loadMore');

    (comp as any).loadNext();

    expect(comp.feedsService.fetch).toHaveBeenCalled();
    expect(comp.feedsService.loadMore).toHaveBeenCalled();
  });

  it('should have a feed notice in top position', () => {
    expect(
      fixture.debugElement.query(By.css(`m-feedNotice__outlet[location="top"]`))
    ).toBeTruthy();
  });

  it('should have a feed notice in inline position', () => {
    let inlineElements = fixture.debugElement.queryAll(
      By.css(`m-feedNotice__outlet[location="inline"]`)
    );
    expect(inlineElements).toBeTruthy();
    expect(inlineElements.length).toBe(4); // pos 6, 12, 18, 24
  });

  it('should determine have boost in position 3', () => {
    expect(comp.shouldShowBoostInPosition(3)).toBe(true);
  });

  it('should determine whether boost should be shown in a non 0 position divisible by 5', () => {
    expect(comp.shouldShowBoostInPosition(5)).toBe(true);
    expect(comp.shouldShowBoostInPosition(10)).toBe(true);
    expect(comp.shouldShowBoostInPosition(15)).toBe(true);
    expect(comp.shouldShowBoostInPosition(20)).toBe(true);
    expect(comp.shouldShowBoostInPosition(25)).toBe(true);
    expect(comp.shouldShowBoostInPosition(9995)).toBe(true);
  });

  it('should determine whether boost should NOT be shown in a non 0 position that is NOT 3 OR divisible by 5', () => {
    expect(comp.shouldShowBoostInPosition(1)).toBe(false);
    expect(comp.shouldShowBoostInPosition(2)).toBe(false);
    expect(comp.shouldShowBoostInPosition(4)).toBe(false);
    expect(comp.shouldShowBoostInPosition(6)).toBe(false);
    expect(comp.shouldShowBoostInPosition(9994)).toBe(false);
    expect(comp.shouldShowBoostInPosition(9996)).toBe(false);
  });

  it('should report that a user is logged in', () => {
    (comp as any).session.isLoggedIn.and.returnValue(true);
    expect(comp.isLoggedIn()).toBeTrue();
  });

  it('should report that a user is NOT logged in', () => {
    (comp as any).session.isLoggedIn.and.returnValue(false);
    expect(comp.isLoggedIn()).toBeFalse();
  });
});
