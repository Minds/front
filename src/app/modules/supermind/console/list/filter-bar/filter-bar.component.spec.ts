import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { MockComponent, MockService } from '../../../../../utils/mock';
import {
  SupermindConsoleListType,
  SupermindConsoleStatusFilterType,
  SupermindState,
} from '../../../supermind.types';
import { SupermindConsoleService } from '../../services/console.service';
import { SupermindConsoleFilterBarComponent } from './filter-bar.component';

describe('SupermindConsoleFilterBarComponent', () => {
  let comp: SupermindConsoleFilterBarComponent;
  let fixture: ComponentFixture<SupermindConsoleFilterBarComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          SupermindConsoleFilterBarComponent,
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
    fixture = TestBed.createComponent(SupermindConsoleFilterBarComponent);
    comp = fixture.componentInstance;

    comp.statusFilterValue$.next(null);
    (comp as any).service.listType$.next('inbox');

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

  it('should set state filter value and emit on status filter change to all', (done: DoneFn) => {
    const status: SupermindConsoleStatusFilterType = 'all';
    comp.statusFilterChange.subscribe((emittedValue: SupermindState) => {
      expect(comp.statusFilterValue$.getValue()).toBe(status);
      expect(emittedValue).toBe(null);
      done();
    });
    comp.onStatusFilterChange(status);
  });

  it('should set state filter value and emit on status filter change to pending', (done: DoneFn) => {
    const status: SupermindConsoleStatusFilterType = 'pending';
    comp.statusFilterChange.subscribe((emittedValue: SupermindState) => {
      expect(comp.statusFilterValue$.getValue()).toBe(status);
      expect(emittedValue).toBe(SupermindState.CREATED);
      done();
    });
    comp.onStatusFilterChange(status);
  });

  it('should set state filter value and emit on status filter change to accepted', (done: DoneFn) => {
    const status: SupermindConsoleStatusFilterType = 'accepted';
    comp.statusFilterChange.subscribe((emittedValue: SupermindState) => {
      expect(comp.statusFilterValue$.getValue()).toBe(status);
      expect(emittedValue).toBe(SupermindState.ACCEPTED);
      done();
    });
    comp.onStatusFilterChange(status);
  });

  it('should set state filter value and emit on status filter change to revoked', (done: DoneFn) => {
    const status: SupermindConsoleStatusFilterType = 'revoked';
    comp.statusFilterChange.subscribe((emittedValue: SupermindState) => {
      expect(comp.statusFilterValue$.getValue()).toBe(status);
      expect(emittedValue).toBe(SupermindState.REVOKED);
      done();
    });
    comp.onStatusFilterChange(status);
  });

  it('should set state filter value and emit on status filter change to rejected', (done: DoneFn) => {
    const status: SupermindConsoleStatusFilterType = 'rejected';
    comp.statusFilterChange.subscribe((emittedValue: SupermindState) => {
      expect(comp.statusFilterValue$.getValue()).toBe(status);
      expect(emittedValue).toBe(SupermindState.REJECTED);
      done();
    });
    comp.onStatusFilterChange(status);
  });

  it('should set state filter value and emit on status filter change to failed', (done: DoneFn) => {
    const status: SupermindConsoleStatusFilterType = 'failed';
    comp.statusFilterChange.subscribe((emittedValue: SupermindState) => {
      expect(comp.statusFilterValue$.getValue()).toBe(status);
      expect(emittedValue).toBe(SupermindState.FAILED);
      done();
    });
    comp.onStatusFilterChange(status);
  });

  it('should set state filter value and emit on status filter change to failed payment', (done: DoneFn) => {
    const status: SupermindConsoleStatusFilterType = 'failed_payment';
    comp.statusFilterChange.subscribe((emittedValue: SupermindState) => {
      expect(comp.statusFilterValue$.getValue()).toBe(status);
      expect(emittedValue).toBe(SupermindState.FAILED_PAYMENT);
      done();
    });
    comp.onStatusFilterChange(status);
  });

  it('should set state filter value and emit on status filter change to expired', (done: DoneFn) => {
    const status: SupermindConsoleStatusFilterType = 'expired';
    comp.statusFilterChange.subscribe((emittedValue: SupermindState) => {
      expect(comp.statusFilterValue$.getValue()).toBe(status);
      expect(emittedValue).toBe(SupermindState.EXPIRED);
      done();
    });
    comp.onStatusFilterChange(status);
  });

  it('should set filter state on list type change to inbox', fakeAsync((
    done: DoneFn
  ) => {
    const listType: SupermindConsoleListType = 'inbox';
    const status: SupermindConsoleStatusFilterType = 'pending';

    comp.ngOnInit();
    (comp as any).service.listType$.next(listType);
    tick();

    comp.statusFilterChange.subscribe((emittedValue: SupermindState) => {
      expect(comp.statusFilterValue$.getValue()).toBe(status);
      expect(emittedValue).toBe(SupermindState.CREATED);
      done();
    });
  }));

  it('should set filter state on list type change to outbox', fakeAsync((
    done: DoneFn
  ) => {
    const listType: SupermindConsoleListType = 'outbox';
    const status: SupermindConsoleStatusFilterType = null;

    comp.ngOnInit();
    (comp as any).service.listType$.next(listType);
    tick();

    comp.statusFilterChange.subscribe((emittedValue: SupermindState) => {
      expect(comp.statusFilterValue$.getValue()).toBe(status);
      expect(emittedValue).toBe(null);
      done();
    });
  }));
});
