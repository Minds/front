import { CommonModule as NgCommonModule } from '@angular/common';

import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  flush,
  tick,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Session } from '../../services/session';
import { sessionMock } from '../../../tests/session-mock.spec';
import { MockComponent, MockService } from '../../utils/mock';
import { IS_TENANT_NETWORK } from '../../common/injection-tokens/tenant-injection-tokens';
import { SearchComponent } from './search.component';
import {
  CountSearchGQL,
  FetchSearchGQL,
} from '../../../graphql/generated.engine';
import { ConfigsService } from '../../common/services/configs.service';
import { MetaService } from '../../common/services/meta.service';
import {
  DiscoveryFeedsContentFilter,
  DiscoveryFeedsService,
} from '../discovery/feeds/feeds.service';
import { ComposerModalService } from '../composer/components/modal/modal.service';
import { PermissionsService } from '../../common/services/permissions.service';
import { SiteService } from '../../common/services/site.service';
import { FeedsService } from '../../common/services/feeds.service';
import { BehaviorSubject, Subject, lastValueFrom } from 'rxjs';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  ParamMap,
} from '@angular/router';

// Spec

describe('SearchComponent', () => {
  let fixture: ComponentFixture<SearchComponent>;
  let comp: SearchComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        SearchComponent,
        MockComponent({ selector: 'm-discovery__feedItem' }),
        MockComponent({ selector: 'm-discovery__settingsButton' }),
        MockComponent({ selector: 'm-discovery__tagWidget' }),
        MockComponent({ selector: 'm-publisherRecommendations' }),
        MockComponent({ selector: 'm-discovery__sidebarTags' }),
        MockComponent({ selector: 'm-discovery__tabs' }),
      ],
      imports: [NgCommonModule, RouterTestingModule],
      providers: [
        {
          provide: FetchSearchGQL,
          useValue: jasmine.createSpyObj('FetchSearchGQL', ['watch']),
        },
        {
          provide: CountSearchGQL,
          useValue: jasmine.createSpyObj('CountSearchGQL', ['watch']),
        },
        {
          provide: ActivatedRoute,
          useValue: MockService(ActivatedRoute, {
            has: ['queryParamMap', 'snapshot'],
            props: {
              queryParamMap: {
                get: () =>
                  new BehaviorSubject<ParamMap>({
                    get: (key: string) => {
                      const map = {
                        f: 'top',
                      };

                      return map[key];
                    },
                    has: () => void 0,
                    getAll: () => void 0,
                    keys: [''],
                  }),
              },
              paramMap: {
                get: () =>
                  new BehaviorSubject<ParamMap>({
                    get: (key: string) => '1',
                    has: () => void 0,
                    getAll: () => void 0,
                    keys: [''],
                  }),
              },
              snapshot: { get: () => new ActivatedRouteSnapshot() },
            },
          }),
        },
        {
          provide: ConfigsService,
          useValue: MockService(ConfigsService),
        },
        {
          provide: MetaService,
          useValue: MockService(MetaService),
        },
        {
          provide: PermissionsService,
          useValue: MockService(PermissionsService),
        },
        {
          provide: ComposerModalService,
          useValue: MockService(ComposerModalService),
        },
        {
          provide: SiteService,
          useValue: MockService(SiteService),
        },
        { provide: Session, useValue: sessionMock },
        { provide: IS_TENANT_NETWORK, useValue: false },
      ],
    }).compileComponents();

    TestBed.overrideComponent(SearchComponent, {
      set: {
        providers: [
          {
            provide: DiscoveryFeedsService,
            useValue: MockService(DiscoveryFeedsService, {
              has: [
                'entities$',
                'type$',
                'inProgress$',
                'hasMoreData$',
                'nsfw$',
                'filter$',
                'period$',
              ],
              props: {
                entities$: { get: () => new BehaviorSubject<any[]>([]) },
                type$: { get: () => new BehaviorSubject<any>('all') },
                inProgress$: { get: () => new BehaviorSubject<any>(false) },
                hasMoreData$: { get: () => new BehaviorSubject<any>(false) },
                nsfw$: { get: () => new BehaviorSubject<any>([]) },
                filter$: {
                  get: () =>
                    new BehaviorSubject<DiscoveryFeedsContentFilter>('latest'),
                },
                period$: { get: () => new BehaviorSubject<any>(null) },
              },
            }),
          },
          { provide: FeedsService, useClass: FeedsService },
        ],
      },
    });

    fixture = TestBed.createComponent(SearchComponent);
    comp = fixture.componentInstance;
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('should display empty feed notice when no edges', fakeAsync(async () => {
    const queryResult = {
      loading: false,
      data: {
        search: {
          edges: [],
          pageInfo: {
            hasNextPage: false,
            endCursor: null,
          },
        },
      },
    };

    (comp as any).fetchSearch.watch.and.returnValue({
      valueChanges: new BehaviorSubject(queryResult),
      refetch: async () => {},
    });

    comp.ngOnInit();

    tick(1000);

    expectAsync(lastValueFrom(comp.showEmptyFeedNotice$)).toBeResolvedTo(true);

    tick(1000);
  }));

  it('should NOT display empty feed notice when no edges', fakeAsync(async () => {
    const queryResult = {
      loading: false,
      data: {
        search: {
          edges: [
            {
              __typename: 'ActivityEdge',
              node: {
                __typename: 'ActivityNode',
              },
            },
          ],
          pageInfo: {
            hasNextPage: false,
            endCursor: null,
          },
        },
      },
    };

    (comp as any).fetchSearch.watch.and.returnValue({
      valueChanges: new BehaviorSubject(queryResult),
      refetch: async () => {},
    });

    comp.ngOnInit();

    tick(1000);

    expectAsync(lastValueFrom(comp.showEmptyFeedNotice$)).toBeResolvedTo(false);

    tick(1000);
  }));
});
