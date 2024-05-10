import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoostConsoleListComponent } from './list.component';
import { BoostConsoleService } from '../services/console.service';
import { BehaviorSubject, of } from 'rxjs';
import {
  BoostConsoleLocationFilter,
  BoostConsolePaymentMethodFilter,
  BoostConsoleStateFilter,
  BoostConsoleSuitabilityFilter,
} from '../../boost.types';
import { MockComponent, MockService } from '../../../../utils/mock';

describe('MyComponent', () => {
  let comp: BoostConsoleListComponent;
  let fixture: ComponentFixture<BoostConsoleListComponent>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      declarations: [
        BoostConsoleListComponent,
        MockComponent({
          selector: 'm-boostConsole__filterBar',
          inputs: ['boostLatestNoticeType'],
        }),
        MockComponent({
          selector: 'm-boostConsole__listItem',
          inputs: ['boost'],
        }),
        MockComponent({
          selector: 'infinite-scroll',
          inputs: ['moreData', 'inProgress'],
          outputs: ['load'],
        }),
      ],
      providers: [
        {
          provide: BoostConsoleService,
          useValue: MockService(BoostConsoleService, {
            has: [
              'adminContext$',
              'stateFilterValue$',
              'locationFilterValue$',
              'suitabilityFilterValue$',
              'paymentMethodFilterValue$',
            ],
            props: {
              adminContext$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
              stateFilterValue$: {
                get: () => new BehaviorSubject<BoostConsoleStateFilter>('all'),
              },
              locationFilterValue$: {
                get: () =>
                  new BehaviorSubject<BoostConsoleLocationFilter>('all'),
              },
              suitabilityFilterValue$: {
                get: () =>
                  new BehaviorSubject<BoostConsoleSuitabilityFilter>('safe'),
              },
              paymentMethodFilterValue$: {
                get: () =>
                  new BehaviorSubject<BoostConsolePaymentMethodFilter>('all'),
              },
            },
          }),
        },
      ],
    });

    fixture = TestBed.createComponent(BoostConsoleListComponent);
    comp = fixture.componentInstance;

    (comp as any).service.getList$.and.returnValue(of([]));

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

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  describe('render filter bar', () => {
    it('should render filter bar when showFilterBar is true', () => {
      (comp as any).showFilterBar = true;

      fixture.detectChanges();

      expect(
        fixture.nativeElement.querySelector('m-boostConsole__filterBar')
      ).toBeDefined();
    });

    it('should NOT render filter bar when showFilterBar is false', () => {
      (comp as any).showFilterBar = false;

      fixture.detectChanges();

      expect(
        fixture.nativeElement.querySelector('m-boostConsole__filterBar')
      ).toBeNull();
    });
  });
});
