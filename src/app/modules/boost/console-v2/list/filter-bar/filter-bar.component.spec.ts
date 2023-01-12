// ojm todo spec tests
// import {
//   ComponentFixture,
//   fakeAsync,
//   TestBed,
//   tick,
//   waitForAsync,
// } from '@angular/core/testing';
// import { BehaviorSubject } from 'rxjs';
// import { MockComponent, MockService } from '../../../../../utils/mock';
// import {
//   BoostConsoleLocationFilter,
//   BoostConsoleStateFilter,
// } from '../../../boost.types';
// import { BoostConsoleService } from '../../services/console.service';
// import { BoostConsoleFilterBarComponent } from './filter-bar.component';

// fdescribe('BoostConsoleFilterBarComponent', () => {
//   let comp: BoostConsoleFilterBarComponent;
//   let fixture: ComponentFixture<BoostConsoleFilterBarComponent>;

//   beforeEach(
//     waitForAsync(() => {
//       TestBed.configureTestingModule({
//         declarations: [
//           BoostConsoleFilterBarComponent,
//           MockComponent({
//             selector: 'm-dropdownMenu',
//           }),
//           MockComponent({
//             selector: 'm-dropdownMenu__item',
//             inputs: ['selected', 'selectable'],
//             outputs: ['click'],
//           }),
//         ],
//         providers: [
//           {
//             provide: BoostConsoleService,
//             useValue: MockService(BoostConsoleService, {
//               has: ['adminContext$', 'stateFilterValue$'],
//               props: {
//                 adminContext$: {
//                   get: () => new BehaviorSubject<boolean>(false),
//                 },
//                 stateFilterValue$: {
//                   get: () =>
//                     new BehaviorSubject<BoostConsoleStateFilter>('all'),
//                 },
//               },
//             }),
//           },
//         ],
//       }).compileComponents();
//     })
//   );

//   beforeEach(done => {
//     fixture = TestBed.createComponent(BoostConsoleFilterBarComponent);
//     comp = fixture.componentInstance;

//     comp.service.stateFilterValue$.next(null);
//     (comp as any).service.adminContext$.next(false);

//     if (fixture.isStable()) {
//       done();
//     } else {
//       fixture.whenStable().then(() => {
//         done();
//       });
//     }
//   });

//   it('should initialize', () => {
//     expect(comp).toBeTruthy();
//   });

//   it('should set state filter value on state filter change to all', (done: DoneFn) => {
//     const state: BoostConsoleStateFilter = 'all';
//     comp.service.stateFilterValue$.subscribe((val: BoostConsoleStateFilter) => {
//       expect(comp.service.stateFilterValue$.getValue()).toBe(state);
//       expect(val).toBe('all');
//       done();
//     });
//     comp.onStateFilterChange(state);
//   });

//   it('should set state filter value on state filter change to pending', (done: DoneFn) => {
//     const state: BoostConsoleStateFilter = 'pending';
//     comp.service.stateFilterValue$.subscribe((val: BoostConsoleStateFilter) => {
//       expect(val).toBe('pending');
//       done();
//     });
//     comp.onStateFilterChange(state);
//   });

//   it('should set state filter value on state filter change to approved', (done: DoneFn) => {
//     const state: BoostConsoleStateFilter = 'approved';
//     comp.service.stateFilterValue$.subscribe((val: BoostConsoleStateFilter) => {
//       expect(comp.service.stateFilterValue$.getValue()).toBe(state);
//       expect(val).toBe('approved');
//       done();
//     });
//     comp.onStateFilterChange(state);
//   });

//   fit('should set state filter value on state filter change to rejected', () => {
//     const state: BoostConsoleStateFilter = 'rejected';
//     // comp.service.stateFilterValue$.subscribe((val: BoostConsoleStateFilter) => {

//     expect(comp.onStateFilterChange(state)).toHaveBeenCalled();
//     expect(comp.service.stateFilterValue$.getValue()).toBe(state);
//     // expect(val).toBe('rejected');
//     // done();
//     // });
//     comp.onStateFilterChange(state);
//   });

//   it('should set state filter value on state filter change to completed', (done: DoneFn) => {
//     const state: BoostConsoleStateFilter = 'completed';
//     comp.service.stateFilterValue$.subscribe((val: BoostConsoleStateFilter) => {
//       expect(comp.service.stateFilterValue$.getValue()).toBe(state);
//       expect(val).toBe('completed');
//       done();
//     });
//     comp.onStateFilterChange(state);
//   });

//   // ----------------------------------

//   it('should set location filter value on location filter change to newsfeed', (done: DoneFn) => {
//     const location: BoostConsoleLocationFilter = 'newsfeed';
//     comp.service.locationFilterValue$.subscribe(
//       (val: BoostConsoleLocationFilter) => {
//         expect(comp.service.locationFilterValue$.getValue()).toBe(location);
//         expect(val).toBe(location);
//         done();
//       }
//     );
//     comp.onLocationFilterChange(location);
//   });
// });
