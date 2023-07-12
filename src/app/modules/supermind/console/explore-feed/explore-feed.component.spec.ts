import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { FeedsService } from '../../../../common/services/feeds.service';
import { SupermindConsoleExploreFeedComponent } from './explore-feed.component';
import { SupermindConsoleService } from '../services/console.service';
import { MockComponent, MockService } from '../../../../utils/mock';
import { BehaviorSubject, of, take } from 'rxjs';

describe('SupermindConsoleExploreFeedComponent', () => {
  let comp: SupermindConsoleExploreFeedComponent;
  let fixture: ComponentFixture<SupermindConsoleExploreFeedComponent>;
  const pendingCount$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        SupermindConsoleExploreFeedComponent,
        MockComponent({ selector: 'm-feedNotice--supermindPending' }),
        MockComponent({
          selector: 'm-activity',
          inputs: ['entity', 'displayOptions'],
        }),
        MockComponent({
          selector: 'infinite-scroll',
          inputs: ['moreData', 'inProgress'],
          outputs: ['load'],
        }),
        MockComponent({
          selector: 'm-loadingSpinner',
          inputs: ['inProgress'],
        }),
      ],
      providers: [
        {
          provide: SupermindConsoleService,
          useValue: MockService(SupermindConsoleService),
        },
      ],
    })
      .overrideProvider(FeedsService, {
        useValue: MockService(FeedsService, {
          has: ['feed', 'inProgress', 'hasMore', 'canFetchMore', 'offset'],
          props: {
            feed: {
              get: () =>
                new BehaviorSubject<any>([
                  of({ guid: 123 }),
                  of({ guid: 234 }),
                  of({ guid: 345 }),
                ]),
            },
            inProgress: { get: () => new BehaviorSubject<boolean>(true) },
            hasMore: { get: () => new BehaviorSubject<boolean>(true) },
            canFetchMore: { get: () => new BehaviorSubject<boolean>(true) },
            offset: { get: () => new BehaviorSubject<number>(0) },
          },
        }),
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupermindConsoleExploreFeedComponent);
    comp = fixture.componentInstance;

    (comp as any).service.countByListType$.and.returnValue(pendingCount$);

    (comp as any).feedsService.setEndpoint.and.returnValue(
      (comp as any).feedsService
    );
    (comp as any).feedsService.setLimit.and.returnValue(
      (comp as any).feedsService
    );
    (comp as any).feedsService.setOffset.and.returnValue(
      (comp as any).feedsService
    );
    (comp as any).feedsService.fetch.and.returnValue(
      (comp as any).feedsService
    );

    (comp as any).feedsService.canFetchMore.next(true);
    (comp as any).feedsService.inProgress.next(true);
    (comp as any).feedsService.offset.next(true);

    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create the component', () => {
    expect(comp).toBeTruthy();
  });

  describe('showPendingSupermindNotice$', () => {
    it('should determine if the component is in a loading state because pendingCountRequest is in progress', (done: DoneFn) => {
      (comp as any).feedsService.inProgress.next(false);
      (comp as any).feedsService.feed.next([]);
      (comp as any).pendingCountRequestInProgress$.next(false);

      comp.loading$.pipe(take(1)).subscribe((loading: boolean) => {
        expect(loading).toBe(false);
        done();
      });
    });

    it('should determine if the component is in a loading state because pendingCountRequest is in progress', (done: DoneFn) => {
      (comp as any).feedsService.inProgress.next(false);
      (comp as any).feedsService.feed.next([]);
      (comp as any).pendingCountRequestInProgress$.next(true);

      comp.loading$.pipe(take(1)).subscribe((loading: boolean) => {
        expect(loading).toBe(true);
        done();
      });
    });

    it('should determine if the component is in a loading state because feed load is in progress and feed is empty', (done: DoneFn) => {
      (comp as any).feedsService.inProgress.next(true);
      (comp as any).feedsService.feed.next([]);
      (comp as any).pendingCountRequestInProgress$.next(false);

      comp.loading$.pipe(take(1)).subscribe((loading: boolean) => {
        expect(loading).toBe(true);
        done();
      });
    });

    it('should determine if the component is NOT in a loading state because feed load is in progress and feed is NOT empty', (done: DoneFn) => {
      (comp as any).feedsService.inProgress.next(true);
      (comp as any).feedsService.feed.next([
        of({ guid: 123 }),
        of({ guid: 234 }),
        of({ guid: 345 }),
      ]);
      (comp as any).pendingCountRequestInProgress$.next(false);

      comp.loading$.pipe(take(1)).subscribe((loading: boolean) => {
        expect(loading).toBe(false);
        done();
      });
    });
  });

  describe('ngOnInit', () => {
    it('should load the feed and count', fakeAsync(() => {
      comp.ngOnInit();
      tick();

      expect((comp as any).feedsService.setEndpoint).toHaveBeenCalledWith(
        'api/v3/newsfeed/superminds'
      );
      expect((comp as any).feedsService.setLimit).toHaveBeenCalledWith(12);
      expect((comp as any).feedsService.setOffset).toHaveBeenCalledWith(0);
      expect((comp as any).feedsService.fetch).toHaveBeenCalled();
    }));

    it('should load the count and show notice if 1 pending supermind', fakeAsync(() => {
      (comp as any).pendingCountRequestInProgress$.next(true);
      (comp as any).showPendingSupermindNotice$.next(99999);
      pendingCount$.next(1);

      comp.ngOnInit();
      tick();

      expect((comp as any).service.countByListType$).toHaveBeenCalled();
      expect(comp.showPendingSupermindNotice$.getValue()).toBe(true);
      expect(comp.pendingCountRequestInProgress$.getValue()).toBe(false);
    }));

    it('should load the count and show notice if 1 pending supermind', fakeAsync(() => {
      (comp as any).pendingCountRequestInProgress$.next(true);
      (comp as any).showPendingSupermindNotice$.next(99999);
      pendingCount$.next(0);

      comp.ngOnInit();
      tick();

      expect((comp as any).service.countByListType$).toHaveBeenCalled();
      expect(comp.showPendingSupermindNotice$.getValue()).toBe(false);
      expect(comp.pendingCountRequestInProgress$.getValue()).toBe(false);
    }));
  });

  describe('loadMore', () => {
    it('should load next and fetch', fakeAsync(() => {
      (comp as any).feedsService.canFetchMore.next(true);
      (comp as any).feedsService.inProgress.next(false);
      (comp as any).feedsService.offset.next(12);

      (comp as any).feedsService.fetch.calls.reset();
      (comp as any).feedsService.loadMore.calls.reset();

      comp.loadNext();
      tick();

      expect((comp as any).feedsService.fetch).toHaveBeenCalled();
      expect((comp as any).feedsService.loadMore).toHaveBeenCalled();
    }));

    it('should load next and NOT fetch if already in progress', fakeAsync(() => {
      (comp as any).feedsService.canFetchMore.next(true);
      (comp as any).feedsService.inProgress.next(true);
      (comp as any).feedsService.offset.next(12);

      (comp as any).feedsService.fetch.calls.reset();
      (comp as any).feedsService.loadMore.calls.reset();

      comp.loadNext();
      tick();

      expect((comp as any).feedsService.fetch).not.toHaveBeenCalled();
      expect((comp as any).feedsService.loadMore).toHaveBeenCalled();
    }));

    it('should load next and NOT fetch if no offset', fakeAsync(() => {
      (comp as any).feedsService.canFetchMore.next(true);
      (comp as any).feedsService.inProgress.next(false);
      (comp as any).feedsService.offset.next(null);

      (comp as any).feedsService.fetch.calls.reset();
      (comp as any).feedsService.loadMore.calls.reset();

      comp.loadNext();
      tick();

      expect((comp as any).feedsService.fetch).not.toHaveBeenCalled();
      expect((comp as any).feedsService.loadMore).toHaveBeenCalled();
    }));
  });

  describe('trackEntityBy', () => {
    it('should track entity by guid', () => {
      expect(comp.trackEntityBy(0, { guid: '123' })).toBe('123');
    });
  });
});
