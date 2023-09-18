import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BoostConsoleFeedComponent, DisplayableBoost } from './feed.component';
import { MockComponent } from '../../../../utils/mock';
import {
  GetBoostFeedGQL,
  GetBoostFeedQuery,
  PageInfo,
} from '../../../../../graphql/generated.engine';
import { BehaviorSubject } from 'rxjs';
import { BoostLocation } from '../../boost.types';
import { ApolloQueryResult } from '@apollo/client';

describe('BoostConsoleFeedComponent', () => {
  let comp: BoostConsoleFeedComponent;
  let fixture: ComponentFixture<BoostConsoleFeedComponent>;

  const mockPageInfo: PageInfo = {
    hasNextPage: true,
    hasPreviousPage: false,
    endCursor: '2',
    startCursor: '',
  };

  const unparsedEdges: any = [
    {
      node: {
        guid: '1234567890123456',
        activity: {
          legacy: JSON.stringify({ guid: '2234567890123456' }),
        },
      },
    },
    {
      node: {
        guid: '3234567890123456',
        activity: {
          legacy: JSON.stringify({ guid: '4234567890123456' }),
        },
      },
    },
    {
      node: {
        guid: '5234567890123456',
        activity: {
          legacy: JSON.stringify({ guid: '6234567890123456' }),
        },
      },
    },
  ];

  const displayableBoosts: DisplayableBoost[] = unparsedEdges.map(edge => {
    return {
      guid: edge.node.guid,
      activity: {
        ...JSON.parse(edge.node.activity.legacy),
        boosted: true,
      },
    };
  });

  const mockResult: ApolloQueryResult<GetBoostFeedQuery> = {
    loading: false,
    networkStatus: 7,
    data: {
      boosts: {
        edges: unparsedEdges,
        pageInfo: mockPageInfo,
      },
    },
  };

  const giftCardsResponse$: BehaviorSubject<ApolloQueryResult<
    GetBoostFeedQuery
  >> = new BehaviorSubject<ApolloQueryResult<GetBoostFeedQuery>>(mockResult);

  let fetchMoreSpy: jasmine.Spy;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          BoostConsoleFeedComponent,
          MockComponent({
            selector: 'm-boostConsole__filterBar',
            inputs: ['showDropdownFilters', 'boostLatestNoticeType'],
          }),
          MockComponent({
            selector: 'm-activity',
            inputs: ['m-clientMeta', 'entity', 'displayOptions'],
          }),
          MockComponent({
            selector: 'infinite-scroll',
            inputs: ['moreData', 'inProgress', 'hideManual'],
            outputs: ['load'],
          }),
        ],
        providers: [
          {
            provide: GetBoostFeedGQL,
            useValue: jasmine.createSpyObj<GetBoostFeedGQL>(['watch']),
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(BoostConsoleFeedComponent);

    comp = fixture.componentInstance;

    (comp as any).getBoostFeedGQL.watch.calls.reset();

    fetchMoreSpy = jasmine.createSpy('fetchMore');

    (comp as any).getBoostFeedGQL.watch.and.returnValue({
      fetchMore: fetchMoreSpy,
      valueChanges: giftCardsResponse$,
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
    expect((comp as any).getBoostFeedGQL.watch).toHaveBeenCalledOnceWith(
      {
        first: (comp as any).pageSize,
        after: 0,
        targetLocation: BoostLocation.NEWSFEED,
        source: 'feed/boosts',
      },
      {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        notifyOnNetworkStatusChange: false,
        errorPolicy: 'all',
        useInitialLoading: true,
      }
    );
    expect(comp.boosts$.getValue()).toEqual(displayableBoosts);
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

  it('should track by guid', () => {
    expect(comp.trackBy(displayableBoosts[0])).toEqual(
      displayableBoosts[0].guid
    );
  });
});
