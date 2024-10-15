import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NetworkAdminConsoleExcludedHashtagsListComponent } from './excluded-hashtags-list.component';
import { GetExcludedHashtagsGQL } from '../../../../../../../../graphql/generated.engine';
import { of } from 'rxjs';

describe('NetworkAdminConsoleExcludedHashtagsListComponent', () => {
  let comp: NetworkAdminConsoleExcludedHashtagsListComponent;
  let fixture: ComponentFixture<NetworkAdminConsoleExcludedHashtagsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NetworkAdminConsoleExcludedHashtagsListComponent],
      providers: [
        {
          provide: GetExcludedHashtagsGQL,
          useValue: jasmine.createSpyObj<GetExcludedHashtagsGQL>(['watch']),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(
      NetworkAdminConsoleExcludedHashtagsListComponent
    );
    comp = fixture.componentInstance;

    (comp as any).getExcludedHashtagsGQL.watch.and.returnValue({
      valueChanges: of({
        loading: false,
        data: {
          hashtagExclusions: {
            edges: [],
            pageInfo: { hasNextPage: false, endCursor: null },
          },
        },
      }),
      fetchMore: jasmine.createSpy('fetchMore'),
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize the getExcludedHashtagsQuery', () => {
      (comp as any).getExcludedHashtagsGQL.watch.and.returnValue({
        valueChanges: of({
          loading: false,
          data: {
            hashtagExclusions: {
              edges: [],
              pageInfo: { hasNextPage: false, endCursor: null },
            },
          },
        }),
        fetchMore: jasmine.createSpy('fetchMore'),
      });

      comp.ngOnInit();

      expect((comp as any).getExcludedHashtagsGQL.watch).toHaveBeenCalledWith(
        { first: 12, after: null },
        jasmine.any(Object)
      );
    });
  });

  describe('fetchMore', () => {
    it('should call fetchMore on the query', () => {
      const fetchMoreSpy = jasmine.createSpy('fetchMore');
      (comp as any).getExcludedHashtagsQuery = { fetchMore: fetchMoreSpy };
      (comp as any).endCursor = '10';

      comp.fetchMore();

      expect(fetchMoreSpy).toHaveBeenCalledWith({
        variables: { after: 10 },
      });
      expect(comp.inProgress$.getValue()).toBe(true);
    });
  });

  describe('trackBy', () => {
    it('should return the id of the item', () => {
      const item = { id: '123', tag: 'test', createdTimestamp: 1234567890 };
      expect(comp.trackBy(0, item)).toBe('123');
    });
  });

  describe('handleQueryResult', () => {
    it('should update excludedHashtagEdges and pagination info', () => {
      const result = {
        data: {
          hashtagExclusions: {
            edges: [
              {
                node: { id: '1', tag: 'test', createdTimestamp: 1234567890 },
                cursor: '1',
              },
            ],
            pageInfo: { hasNextPage: true, endCursor: '1' },
          },
        },
      };

      (comp as any).handleQueryResult(result);

      expect(comp.excludedHashtagEdges$.getValue()).toEqual([
        {
          node: { id: '1', tag: 'test', createdTimestamp: 1234567890 },
          cursor: '1',
        },
      ]);
      expect(comp.hasNextPage$.getValue()).toBe(true);
      expect((comp as any).endCursor).toBe('1');
    });
  });

  describe('removeHashtagExclusion', () => {
    it('should remove the specified hashtag from the list', async () => {
      comp.excludedHashtagEdges$.next([
        {
          node: { id: '1', tag: 'test1', createdTimestamp: 1234567890 },
          cursor: '1',
        },
        {
          node: { id: '2', tag: 'test2', createdTimestamp: 1234567891 },
          cursor: '2',
        },
      ]);

      await comp.removeHashtagExclusion('test1');

      expect(comp.excludedHashtagEdges$.getValue()).toEqual([
        {
          node: { id: '2', tag: 'test2', createdTimestamp: 1234567891 },
          cursor: '2',
        },
      ]);
    });
  });
});
