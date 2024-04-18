import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NetworkAdminAnalyticsTableService } from './table.service';
import { ToasterService } from '../../../../../../common/services/toaster.service';
import { MockService } from '../../../../../../utils/mock';
import {
  ActivityNode,
  AnalyticsTableEnum,
  GetTenantAnalyticsTableGQL,
  GetTenantAnalyticsTableQuery,
} from '../../../../../../../graphql/generated.engine';
import * as moment from 'moment';
import { of } from 'rxjs';
import { ApolloQueryResult } from '@apollo/client';

const mockGetTenantAnalyticsTableQueryResponse: ApolloQueryResult<GetTenantAnalyticsTableQuery> =
  {
    loading: false,
    networkStatus: 7,
    data: {
      tenantAdminAnalyticsTable: {
        edges: [
          {
            node: {
              id: '123',
              engagements: 100,
              activity: { guid: '123' } as ActivityNode,
            },
            cursor: '123',
          },
        ],
        pageInfo: {
          __typename: 'PageInfo',
          endCursor: null,
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: null,
        },
      },
    },
  };

describe('NetworkAdminAnalyticsTableService', () => {
  let service: NetworkAdminAnalyticsTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NetworkAdminAnalyticsTableService,
        { provide: ToasterService, useValue: MockService(ToasterService) },
        {
          provide: GetTenantAnalyticsTableGQL,
          useValue: jasmine.createSpyObj<GetTenantAnalyticsTableGQL>(['watch']),
        },
      ],
    });

    service = TestBed.inject(NetworkAdminAnalyticsTableService);
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  it('should initialise query and subscriptions', fakeAsync(() => {
    const tableType: AnalyticsTableEnum = AnalyticsTableEnum.PopularActivities;
    const fromUnixTimestamp: number = moment().subtract(1, 'day').unix();
    const toUnixTimestamp: number = moment().unix();

    (service as any).getTenantAnalyticsTableGQL.watch.and.returnValue({
      valueChanges: of(mockGetTenantAnalyticsTableQueryResponse),
    });

    service.init(tableType, fromUnixTimestamp, toUnixTimestamp);
    tick();

    expect(
      (service as any).getTenantAnalyticsTableGQL.watch
    ).toHaveBeenCalledWith(
      {
        table: tableType,
        fromUnixTs: fromUnixTimestamp,
        toUnixTs: toUnixTimestamp,
        limit: 24,
      },
      {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        notifyOnNetworkStatusChange: false,
        errorPolicy: 'all',
        useInitialLoading: true,
      }
    );

    expect((service as any)._edges$.getValue()).toEqual(
      mockGetTenantAnalyticsTableQueryResponse.data.tenantAdminAnalyticsTable
        .edges
    );
    expect((service as any)._pageInfo$.getValue()).toEqual(
      mockGetTenantAnalyticsTableQueryResponse.data.tenantAdminAnalyticsTable
        .pageInfo
    );
    expect((service as any)._inProgress$.getValue()).toBeFalse();
    expect((service as any)._initialized$.getValue()).toBeTrue();
  }));
});
