import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ApolloQueryResult } from '@apollo/client';
import { BehaviorSubject } from 'rxjs';
import {
  GetReportsGQL,
  GetReportsQuery,
  PageInfo,
  ReportActionEnum,
  ReportEdge,
  ReportStatusEnum,
  UserEdge,
} from '../../../../../../../graphql/generated.engine';
import { NetworkAdminConsoleReportsListComponent } from './reports-list.component';
import { MockComponent } from '../../../../../../utils/mock';
import userMock from '../../../../../../mocks/responses/user.mock';

describe('NetworkAdminConsoleReportsListComponent', () => {
  let comp: NetworkAdminConsoleReportsListComponent;
  let fixture: ComponentFixture<NetworkAdminConsoleReportsListComponent>;

  const mockPageInfo: PageInfo = {
    hasNextPage: true,
    hasPreviousPage: false,
    endCursor: '2',
    startCursor: '',
  };

  const userMock2 = {
    guid: '2234567890123456',
    ...userMock,
  };

  const mockReportEdges: ReportEdge[] = [
    {
      cursor: '1',
      node: {
        __typename: 'Report',
        action: ReportActionEnum.Delete,
        createdTimestamp: Date.now(),
        cursor: '1',
        entityEdge: {
          __typename: 'UserEdge',
          cursor: '1',
          node: {
            legacy: JSON.stringify(userMock),
          },
        },
        entityGuid: '1234567890123456',
        entityUrn: 'urn:user:1234567890123456',
        id: '2',
        illegalSubReason: null,
        moderatedByGuid: '2234567890123456',
        nsfwSubReason: null,
        reason: null,
        reportGuid: '3234567890123456',
        reportedByGuid: '4234567890123456',
        reportedByUserEdge: {
          __typename: 'UserEdge',
          cursor: '1',
          id: '223',
          type: 'UserEdge',
          node: {
            legacy: JSON.stringify(userMock),
          },
        },
        securitySubReason: null,
        status: ReportStatusEnum.Pending,
        tenantId: '123',
        updatedTimestamp: Date.now(),
      },
      type: 'mockType',
      __typename: 'ReportEdge',
    } as ReportEdge,
    {
      cursor: '1',
      node: {
        __typename: 'Report',
        action: ReportActionEnum.Delete,
        createdTimestamp: Date.now(),
        cursor: '1',
        entityEdge: {
          __typename: 'UserEdge',
          cursor: '1',
          node: {
            legacy: JSON.stringify(userMock2),
          },
        },
        entityGuid: '2334567890123456',
        entityUrn: 'urn:user:2334567890123456',
        id: '3',
        illegalSubReason: null,
        moderatedByGuid: '3334567890123456',
        nsfwSubReason: null,
        reason: null,
        reportGuid: '4434567890123456',
        reportedByGuid: '5534567890123456',
        reportedByUserEdge: {
          __typename: 'UserEdge',
          cursor: '1',
          id: '345',
          type: 'UserEdge',
          node: {
            legacy: JSON.stringify(userMock2),
          },
        },
        securitySubReason: null,
        status: ReportStatusEnum.Pending,
        tenantId: '123',
        updatedTimestamp: Date.now(),
      },
      type: 'mockType',
      __typename: 'ReportEdge',
    } as ReportEdge,
  ];

  const mockResult: ApolloQueryResult<GetReportsQuery> = {
    loading: false,
    networkStatus: 7,
    data: {
      reports: {
        __typename: 'ReportsConnection',
        id: '123',
        edges: mockReportEdges,
        pageInfo: mockPageInfo,
      },
    },
  };

  const getReportsResponse$: BehaviorSubject<ApolloQueryResult<
    GetReportsQuery
  >> = new BehaviorSubject<ApolloQueryResult<GetReportsQuery>>(mockResult);

  let fetchMoreSpy: jasmine.Spy;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          NetworkAdminConsoleReportsListComponent,
          MockComponent({
            selector: 'm-networkAdminConsole__report',
            inputs: ['reportEdge'],
            outputs: ['verdictProvided'],
          }),
          MockComponent({
            selector: 'infinite-scroll',
            inputs: ['moreData', 'inProgress', 'hideManual'],
            outputs: ['load'],
          }),
        ],
        providers: [
          {
            provide: GetReportsGQL,
            useValue: jasmine.createSpyObj<GetReportsGQL>(['watch']),
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(NetworkAdminConsoleReportsListComponent);

    comp = fixture.componentInstance;

    (comp as any).getReportsGQL.watch.calls.reset();

    fetchMoreSpy = jasmine.createSpy('fetchMore');

    (comp as any).getReportsGQL.watch.and.returnValue({
      fetchMore: fetchMoreSpy,
      valueChanges: getReportsResponse$,
    });

    fixture.detectChanges();

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        done();
      });
    }
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
    expect((comp as any).getReportsGQL.watch).toHaveBeenCalledOnceWith(
      {
        status: ReportStatusEnum.Pending,
        first: (comp as any).pageSize,
        after: 0,
      },
      {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        notifyOnNetworkStatusChange: false,
        errorPolicy: 'all',
        useInitialLoading: true,
      }
    );
    expect(comp.reportEdges$.getValue()).toEqual(mockReportEdges);
  });

  it('should fetch more', () => {
    fetchMoreSpy.calls.reset();
    (comp as any).endCursor = 12;

    comp.fetchMore();

    expect(fetchMoreSpy).toHaveBeenCalledOnceWith({
      variables: {
        after: 12,
      },
    });
  });

  it('should track by id', () => {
    expect(comp.trackBy(0, mockReportEdges[0].node)).toEqual(
      mockReportEdges[0].node.id + mockReportEdges[0].node.reportGuid
    );
  });

  describe('onVerdictProvided', () => {
    it('should remove report edge from list', () => {
      comp.hasNextPage$.next(false);
      comp.onVerdictProvided(mockReportEdges[0]);
      expect(comp.reportEdges$.getValue()).toEqual([mockReportEdges[1]]);
    });

    it('should remove report edge from list and load more if there are more', () => {
      fetchMoreSpy.calls.reset();
      (comp as any).endCursor = 12;
      comp.hasNextPage$.next(true);
      comp.reportEdges$.next([mockReportEdges[0]]);

      comp.onVerdictProvided(mockReportEdges[0]);

      expect(comp.reportEdges$.getValue()).toEqual([]);
      expect(fetchMoreSpy).toHaveBeenCalledOnceWith({
        variables: {
          after: 12,
        },
      });
    });
  });
});
