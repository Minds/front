import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NetworkAdminAnalyticsTableComponent } from './table.component';
import { MockComponent, MockService } from '../../../../../../../utils/mock';
import { WINDOW } from '../../../../../../../common/injection-tokens/common-injection-tokens';
import { NetworkAdminAnalyticsTimespanFiltersService } from '../../services/timespan-filters.service';
import { NetworkAdminAnalyticsTableService } from '../../services/table.service';
import { ActivatedRoute, Params } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import {
  AnalyticsTableEnum,
  PageInfo,
} from '../../../../../../../../graphql/generated.engine';
import * as moment from 'moment';

describe('NetworkAdminAnalyticsTableComponent', () => {
  let comp: NetworkAdminAnalyticsTableComponent;
  let fixture: ComponentFixture<NetworkAdminAnalyticsTableComponent>;
  let instantiationTimestamp: moment.Moment = moment();

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      declarations: [
        NetworkAdminAnalyticsTableComponent,
        MockComponent({
          selector: 'minds-avatar',
          inputs: ['object'],
        }),
        MockComponent({
          selector: 'infinite-scroll',
          inputs: ['moreData', 'inProgress', 'hideManual'],
          outputs: ['load'],
        }),
        MockComponent({
          selector: 'm-loadingSpinner',
          inputs: ['inProgress'],
        }),
        MockComponent({
          selector: 'm-networkAdminAnalytics__emptyStateCardWrapper',
          inputs: ['type'],
        }),
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: MockService(ActivatedRoute, {
            has: ['queryParams', 'params'],
            props: {
              queryParams: {
                get: () => new BehaviorSubject<Params>({ timespan: '30d' }),
              },
              params: {
                get: () => new BehaviorSubject<Params>({ typeParam: 'users' }),
              },
            },
          }),
        },
        {
          provide: NetworkAdminAnalyticsTimespanFiltersService,
          useValue: MockService(NetworkAdminAnalyticsTimespanFiltersService, {
            has: ['instantiationTimestamp'],
            props: {
              instantiationTimestamp: {
                get: () => instantiationTimestamp,
              },
            },
          }),
        },
        {
          provide: WINDOW,
          useValue: {
            open: jasmine.createSpy('open'),
          },
        },
      ],
    }).overrideProvider(NetworkAdminAnalyticsTableService, {
      useValue: MockService(NetworkAdminAnalyticsTableService, {
        has: ['inProgress$', 'initialized$', 'pageInfo$', 'edges$'],
        props: {
          inProgress$: {
            get: () => new BehaviorSubject<boolean>(false),
          },
          initialized$: {
            get: () => new BehaviorSubject<boolean>(true),
          },
          pageInfo$: {
            get: () =>
              new BehaviorSubject<PageInfo>({ hasNextPage: true } as PageInfo),
          },
          edges$: {
            get: () => new BehaviorSubject<boolean>(null),
          },
        },
      }),
    });

    fixture = TestBed.createComponent(NetworkAdminAnalyticsTableComponent);
    comp = fixture.componentInstance;

    spyOn(console, 'warn');

    (comp as any).timespanFiltersService.getOptionById.and.returnValue({
      id: '30d',
      label: 'Last 30 days',
      selected: true,
      from_ts_ms: instantiationTimestamp
        .clone()
        .subtract(30, 'days')
        .startOf('day')
        .unix(),
    });

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
    (comp as any).tableService.init(
      (comp as any).type,
      (comp as any).selectedTimespanOption.from_ts_ms,
      instantiationTimestamp.unix()
    );
  });

  it('should fetch more', () => {
    (comp as any).fetchMore();
    expect((comp as any).tableService.fetchMore).toHaveBeenCalledTimes(1);
  });

  describe('handleTableRowClick', () => {
    it('should handle table row click for activity', () => {
      (comp as any).handleTableRowClick({
        node: {
          __typename: 'AnalyticsTableRowActivityNode',
          activity: { guid: '1234567890123456' },
        },
      });

      expect((comp as any).window.open).toHaveBeenCalledOnceWith(
        '/newsfeed/1234567890123456',
        '_blank'
      );
    });

    it('should handle table row click for groups', () => {
      (comp as any).handleTableRowClick({
        node: {
          __typename: 'AnalyticsTableRowGroupNode',
          group: { guid: '1234567890123456' },
        },
      });

      expect((comp as any).window.open).toHaveBeenCalledOnceWith(
        '/group/1234567890123456/latest',
        '_blank'
      );
    });

    it('should handle table row click for users', () => {
      (comp as any).handleTableRowClick({
        node: {
          __typename: 'AnalyticsTableRowUserNode',
          user: { username: 'username' },
        },
      });

      expect((comp as any).window.open).toHaveBeenCalledOnceWith(
        '/username',
        '_blank'
      );
    });
  });

  describe('parseTableEnumTypeFromString', () => {
    it('should parse type for posts', () => {
      expect((comp as any).parseTableEnumTypeFromString('posts')).toBe(
        AnalyticsTableEnum.PopularActivities
      );
    });

    it('should parse type for groups', () => {
      expect((comp as any).parseTableEnumTypeFromString('groups')).toBe(
        AnalyticsTableEnum.PopularGroups
      );
    });

    it('should parse type for channels', () => {
      expect((comp as any).parseTableEnumTypeFromString('channels')).toBe(
        AnalyticsTableEnum.PopularUsers
      );
    });
  });
});
