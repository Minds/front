import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { BehaviorSubject, of } from 'rxjs';
import { SupermindConsoleListComponent } from './list.component';
import { SupermindConsoleService } from '../console.service';
import { MockComponent, MockService } from '../../../../utils/mock';
import { SupermindConsoleListType } from '../../supermind.types';
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

    comp.list$.next([]);
    comp.inProgress$.next(false);
    (comp as any).service.getList$.and.returnValue(of([]));

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
    comp.setupListTypeSubscription();
    tick();

    expect((comp as any).service.getList$).toHaveBeenCalled();
    expect(comp.list$.getValue()).toEqual(mockList);
    expect(comp.moreData$.getValue()).toBeTrue();
    expect(comp.inProgress$.getValue()).toBeFalse();
  }));

  it('should load next when there is more data', fakeAsync(() => {
    comp.list$.next(mockList);
    (comp as any).service.getList$.and.returnValue(of(mockList));
    comp.loadNext();
    tick();

    expect((comp as any).service.getList$).toHaveBeenCalled();
    expect(comp.list$.getValue()).toEqual([...mockList, ...mockList]);
    expect(comp.moreData$.getValue()).toBeTrue();
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
});
