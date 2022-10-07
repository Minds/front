import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { BehaviorSubject, of } from 'rxjs';
import { SupermindConsoleListComponent } from './list.component';
import { SupermindConsoleService } from '../services/console.service';
import { MockComponent, MockService } from '../../../../utils/mock';
import {
  SupermindConsoleListType,
  SupermindState,
} from '../../supermind.types';
import { take } from 'rxjs/operators';

describe('SupermindConsoleListComponent', () => {
  let comp: SupermindConsoleListComponent;
  let fixture: ComponentFixture<SupermindConsoleListComponent>;

  const mockList = [
    {
      guid: '123',
      activity_guid: '234',
      sender_guid: '345',
      receiver_guid: '456',
      status: '1',
      payment_amount: 1,
      payment_method: 1,
      payment_txid: '567',
      created_timestamp: 1662715004,
      updated_timestamp: 1662715004,
      expiry_threshold: 604800,
      twitter_required: true,
      reply_type: 1,
      entity: {},
    },
    {
      guid: '123',
      activity_guid: '234',
      sender_guid: '345',
      receiver_guid: '456',
      status: '1',
      payment_amount: 1,
      payment_method: 1,
      payment_txid: '567',
      created_timestamp: 1662715004,
      updated_timestamp: 1662715004,
      expiry_threshold: 604800,
      twitter_required: true,
      reply_type: 1,
      entity: {},
    },
  ];

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          SupermindConsoleListComponent,
          MockComponent({
            selector: 'infinite-scroll',
            inputs: ['moreData', 'inProgress'],
          }),
          MockComponent({
            selector: 'm-supermind__filterBar',
            outputs: ['statusFilterChange'],
          }),
          MockComponent({
            selector: 'm-seeLatestButton',
            inputs: ['newCount'],
            outputs: ['click', 'poll'],
          }),
        ],
        providers: [
          {
            provide: SupermindConsoleService,
            useValue: MockService(SupermindConsoleService, {
              has: ['listType$'],
              props: {
                listType$: {
                  get: () =>
                    new BehaviorSubject<SupermindConsoleListType>('inbox'),
                },
              },
            }),
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(SupermindConsoleListComponent);
    comp = fixture.componentInstance;

    (comp as any).service.getList$.calls.reset();
    comp.list$.next([]);
    comp.inProgress$.next(false);
    (comp as any).service.getList$.and.returnValue(of([]));
    comp.initialCount$.next(0);
    comp.updatedCount$.next(0);

    (comp as any).service.countAll$.calls.reset();

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

  it('should load', fakeAsync(() => {
    (comp as any).service.getList$.and.returnValue(of(mockList));
    comp.setupSubscription();
    tick();

    expect((comp as any).service.getList$).toHaveBeenCalled();
    expect(comp.list$.getValue()).toEqual(mockList);
    expect(comp.moreData$.getValue()).toBeFalse();
    expect(comp.inProgress$.getValue()).toBeFalse();
  }));

  it('should load with status filter', fakeAsync(() => {
    const statusFilterValue: SupermindState = 3;
    (comp as any).service.getList$.and.returnValue(of(mockList));
    comp.onStatusFilterChange(statusFilterValue);
    comp.setupSubscription();
    tick();

    expect((comp as any).service.getList$).toHaveBeenCalledWith(
      12,
      0,
      statusFilterValue
    );
    expect(comp.list$.getValue()).toEqual(mockList);
    expect(comp.moreData$.getValue()).toBeFalse();
    expect(comp.inProgress$.getValue()).toBeFalse();
  }));

  it('should load next when there is more data', fakeAsync(() => {
    comp.list$.next(mockList);
    (comp as any).service.getList$.and.returnValue(of(mockList));
    comp.loadNext();
    tick();

    expect((comp as any).service.getList$).toHaveBeenCalled();
    expect(comp.list$.getValue()).toEqual([...mockList, ...mockList]);
    expect(comp.moreData$.getValue()).toBeFalse();
    expect(comp.inProgress$.getValue()).toBeFalse();
  }));

  it('should load next when there is more data with status filter', fakeAsync(() => {
    comp.list$.next(mockList);
    (comp as any).service.getList$.and.returnValue(of(mockList));
    const statusFilterValue: SupermindState = 3;
    comp.onStatusFilterChange(statusFilterValue);
    comp.loadNext();
    tick();

    expect((comp as any).service.getList$).toHaveBeenCalledWith(
      12,
      2,
      statusFilterValue
    );
    expect(comp.list$.getValue()).toEqual([...mockList, ...mockList]);
    expect(comp.moreData$.getValue()).toBeFalse();
    expect(comp.inProgress$.getValue()).toBeFalse();
  }));

  it('should NOT load next when there is NO more data', fakeAsync(() => {
    comp.list$.next(mockList);
    (comp as any).service.getList$.and.returnValue(of([]));
    comp.loadNext();
    tick();

    expect((comp as any).service.getList$).toHaveBeenCalled();
    expect(comp.list$.getValue()).toEqual(mockList);
    expect(comp.moreData$.getValue()).toBeFalse();
    expect(comp.inProgress$.getValue()).toBeFalse();
  }));

  it("should determine if 'no offers' text should be shown", (done: DoneFn) => {
    comp.list$.next([]);
    comp.shouldShowNoOffersText$
      .pipe(take(1))
      .subscribe((shouldShowNoOffersText: boolean) => {
        expect(shouldShowNoOffersText).toBeTrue();
        done();
      });
  });

  it("should determine if 'no offers' text should NOT be shown because list is empty", (done: DoneFn) => {
    comp.list$.next(mockList);
    comp.shouldShowNoOffersText$
      .pipe(take(1))
      .subscribe((shouldShowNoOffersText: boolean) => {
        expect(shouldShowNoOffersText).toBeFalse();
        done();
      });
  });

  it("should determine if 'no offers' text should NOT be shown because loading is in progress", (done: DoneFn) => {
    comp.list$.next([]);
    comp.inProgress$.next(true);
    comp.shouldShowNoOffersText$
      .pipe(take(1))
      .subscribe((shouldShowNoOffersText: boolean) => {
        expect(shouldShowNoOffersText).toBeFalse();
        done();
      });
  });

  it('should calculate new count correctly when initial count is NOT set', (done: DoneFn) => {
    comp.initialCount$.next(null);
    comp.updatedCount$.next(10);
    comp.newCount$.pipe(take(1)).subscribe((newCount: number) => {
      expect(newCount).toBe(0);
      done();
    });
  });

  it('should calculate new count correctly when initial count is set and there is a difference', (done: DoneFn) => {
    comp.initialCount$.next(1);
    comp.updatedCount$.next(10);
    comp.newCount$.pipe(take(1)).subscribe((newCount: number) => {
      expect(newCount).toBe(9);
      done();
    });
  });

  it('should calculate new count correctly when initial count is set and there is NOT a difference', (done: DoneFn) => {
    comp.initialCount$.next(1);
    comp.updatedCount$.next(1);
    comp.newCount$.pipe(take(1)).subscribe((newCount: number) => {
      expect(newCount).toBe(0);
      done();
    });
  });

  it('should call to count and set initial count if it is not already set with no status', fakeAsync(() => {
    const expectedCount: number = 10;
    (comp as any).service.countAll$.and.returnValue(of(expectedCount));

    comp.populateCounts();
    tick();

    expect((comp as any).service.countAll$).toHaveBeenCalled();
    expect((comp as any).initialCount$.getValue()).toBe(10);
    expect((comp as any).updatedCount$.getValue()).toBe(10);
  }));

  it('should call to count and set initial count if it is not already set with no status', fakeAsync(() => {
    const expectedInitialCount: number = 9;
    const expectedCount: number = 10;
    comp.initialCount$.next(expectedInitialCount);
    (comp as any).service.countAll$.and.returnValue(of(expectedCount));

    comp.populateCounts();
    tick();

    expect((comp as any).service.countAll$).toHaveBeenCalled();
    expect((comp as any).initialCount$.getValue()).toBe(expectedInitialCount);
    expect((comp as any).updatedCount$.getValue()).toBe(10);
  }));

  it('should call to count and set initial count with status', fakeAsync(() => {
    const expectedCount: number = 10;
    const expectedStateFilterValue: number = 7;
    comp.statusFilterValue$.next(expectedStateFilterValue);
    (comp as any).service.countAll$.and.returnValue(of(expectedCount));

    comp.populateCounts();
    tick();

    expect((comp as any).service.countAll$).toHaveBeenCalledWith(
      expectedStateFilterValue
    );
  }));

  it('should reset feed and reload on see latest click', fakeAsync(() => {
    comp.list$.next(mockList);
    (comp as any).service.getList$.and.returnValue(of(mockList));

    spyOn(window, 'scrollTo').and.returnValue(null);

    comp.onSeeLatestClick();
    tick();

    expect(window.scrollTo).toHaveBeenCalled();
    expect((comp as any).service.getList$).toHaveBeenCalled();
    expect(comp.list$.getValue()).toEqual(mockList); // not appended
    expect(comp.moreData$.getValue()).toBeFalse();
    expect(comp.inProgress$.getValue()).toBeFalse();
  }));
});
