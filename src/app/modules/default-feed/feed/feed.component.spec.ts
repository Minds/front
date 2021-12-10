import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DefaultFeedComponent } from './feed.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MockComponent, MockService } from '../../../utils/mock';
import { FeedsService } from '../../../common/services/feeds.service';
import { GlobalScrollService } from '../../../services/ux/global-scroll.service';
import { By } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';

const inProgress: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
const offset: BehaviorSubject<number> = new BehaviorSubject<number>(12);
const feed: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
const hasMore: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

const feedsServiceMock = MockService(FeedsService, {
  has: ['inProgress', 'offset', 'feed', 'hasMore'],
  props: {
    inProgress: { get: () => inProgress },
    offset: { get: () => offset },
    feed: { get: () => feed },
    hasMore: { get: () => hasMore },
  },
});

describe('DefaultFeedComponent', () => {
  let comp: DefaultFeedComponent;
  let fixture: ComponentFixture<DefaultFeedComponent>;

  beforeEach(
    waitForAsync(() => {
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
          DefaultFeedComponent,
        ],
        imports: [RouterTestingModule, ReactiveFormsModule],
        providers: [
          {
            provide: GlobalScrollService,
            useValue: MockService(GlobalScrollService),
          },
        ],
      })
        .overrideComponent(DefaultFeedComponent, {
          set: {
            providers: [
              {
                provide: FeedsService,
                useValue: feedsServiceMock,
              },
            ],
          },
        })
        .compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(DefaultFeedComponent);
    comp = fixture.componentInstance;
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
  });

  it('should have loaded an activity', () => {
    expect(By.css('m-activity')).toBeDefined();
  });

  it('should have an infinite scroll component', () => {
    expect(By.css('infinite-scroll')).toBeDefined();
  });

  it('should load', () => {
    (comp.feedsService as any).setEndpoint.and.returnValue(comp.feedsService);
    (comp.feedsService as any).setLimit.and.returnValue(comp.feedsService);

    (comp as any).load();

    expect(comp.feedsService.setEndpoint).toHaveBeenCalledWith(
      'api/v3/newsfeed/default-feed'
    );
    expect(comp.feedsService.setLimit).toHaveBeenCalledWith(12);
    expect(comp.feedsService.fetch).toHaveBeenCalledWith(false);
  });

  it('should call to load more', () => {
    comp.feedsService.inProgress.next(false);
    comp.feedsService.offset.next(12);
    comp.feedsService.canFetchMore = true;

    (comp as any).loadNext();

    expect(comp.feedsService.fetch).toHaveBeenCalled();
    expect(comp.feedsService.loadMore).toHaveBeenCalled();
  });
});
