import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { MockComponent, MockService } from '../../../../../utils/mock';
import { BoostConsoleStateFilter } from '../../../boost.types';
import { BoostConsoleService } from '../../services/console.service';
import { BoostConsoleFilterBarComponent } from './filter-bar.component';

describe('BoostConsoleFilterBarComponent', () => {
  let comp: BoostConsoleFilterBarComponent;
  let fixture: ComponentFixture<BoostConsoleFilterBarComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          BoostConsoleFilterBarComponent,
          MockComponent({
            selector: 'm-dropdownMenu',
          }),
          MockComponent({
            selector: 'm-dropdownMenu__item',
            inputs: ['selected', 'selectable'],
            outputs: ['click'],
          }),
        ],
        providers: [
          {
            provide: BoostConsoleService,
            useValue: MockService(BoostConsoleService, {
              has: ['adminContext$'],
              props: {
                listType$: {
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
    fixture = TestBed.createComponent(BoostConsoleFilterBarComponent);
    comp = fixture.componentInstance;

    comp.service.stateFilterValue$.next(null);
    (comp as any).service.adminContext$.next(false);

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

  it('should set state filter value and emit on state filter change to all', (done: DoneFn) => {
    const state: BoostConsoleStateFilter = 'all';
    comp.service.stateFilterValue$.subscribe((val: BoostConsoleStateFilter) => {
      expect(comp.service.stateFilterValue$.getValue()).toBe(state);
      expect(val).toBe('all');
      done();
    });
    comp.onStateFilterChange(state);
  });

  // it('should set state filter value and emit on state filter change to pending', (done: DoneFn) => {
  //   const state: BoostConsoleStateFilterType = 'pending';
  //   comp.stateFilterChange.subscribe((emittedValue: BoostState) => {
  //     expect(comp.stateFilterValue$.getValue()).toBe(state);
  //     expect(emittedValue).toBe(BoostState.CREATED);
  //     done();
  //   });
  //   comp.onStateFilterChange(state);
  // });

  // it('should set state filter value and emit on state filter change to approved', (done: DoneFn) => {
  //   const state: BoostConsoleStateFilterType = 'approved';
  //   comp.stateFilterChange.subscribe((emittedValue: BoostState) => {
  //     expect(comp.stateFilterValue$.getValue()).toBe(state);
  //     expect(emittedValue).toBe(BoostState.APPROVED);
  //     done();
  //   });
  //   comp.onStateFilterChange(state);
  // });

  // it('should set state filter value and emit on state filter change to rejected', (done: DoneFn) => {
  //   const state: BoostConsoleStateFilterType = 'rejected';
  //   comp.stateFilterChange.subscribe((emittedValue: BoostState) => {
  //     expect(comp.stateFilterValue$.getValue()).toBe(state);
  //     expect(emittedValue).toBe(BoostState.REJECTED);
  //     done();
  //   });
  //   comp.onStateFilterChange(state);
  // });

  // it('should set state filter value and emit on state filter change to failed', (done: DoneFn) => {
  //   const state: BoostConsoleStateFilterType = 'failed';
  //   comp.stateFilterChange.subscribe((emittedValue: BoostState) => {
  //     expect(comp.stateFilterValue$.getValue()).toBe(state);
  //     expect(emittedValue).toBe(BoostState.FAILED);
  //     done();
  //   });
  //   comp.onStateFilterChange(state);
  // });

  // it('should set state filter value and emit on state filter change to failed payment', (done: DoneFn) => {
  //   const state: BoostConsoleStateFilterType = 'failed_payment';
  //   comp.stateFilterChange.subscribe((emittedValue: BoostState) => {
  //     expect(comp.stateFilterValue$.getValue()).toBe(state);
  //     expect(emittedValue).toBe(BoostState.FAILED_PAYMENT);
  //     done();
  //   });
  //   comp.onStateFilterChange(state);
  // });

  // it('should set state filter value and emit on state filter change to expired', (done: DoneFn) => {
  //   const state: BoostConsoleStateFilterType = 'expired';
  //   comp.stateFilterChange.subscribe((emittedValue: BoostState) => {
  //     expect(comp.stateFilterValue$.getValue()).toBe(state);
  //     expect(emittedValue).toBe(BoostState.EXPIRED);
  //     done();
  //   });
  //   comp.onStateFilterChange(state);
  // });

  // it('should set filter state on list type change to inbox', fakeAsync((
  //   done: DoneFn
  // ) => {
  //   const listType: BoostConsoleListType = 'inbox';
  //   const state: BoostConsoleStateFilterType = 'pending';

  //   comp.ngOnInit();
  //   (comp as any).service.listType$.next(listType);
  //   tick();

  //   comp.stateFilterChange.subscribe((emittedValue: BoostState) => {
  //     expect(comp.stateFilterValue$.getValue()).toBe(state);
  //     expect(emittedValue).toBe(BoostState.CREATED);
  //     done();
  //   });
  // }));

  // it('should set filter state on list type change to outbox', fakeAsync((
  //   done: DoneFn
  // ) => {
  //   const listType: BoostConsoleListType = 'outbox';
  //   const state: BoostConsoleStateFilterType = null;

  //   comp.ngOnInit();
  //   (comp as any).service.listType$.next(listType);
  //   tick();

  //   comp.stateFilterChange.subscribe((emittedValue: BoostState) => {
  //     expect(comp.stateFilterValue$.getValue()).toBe(state);
  //     expect(emittedValue).toBe(null);
  //     done();
  //   });
  // }));
});
