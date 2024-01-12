import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { BehaviorSubject, Subject, of, throwError } from 'rxjs';
import {
  FeaturedEntity,
  FeaturedEntityTypeEnum,
  GetFeaturedEntitiesGQL,
  StoreFeaturedEntityGQL,
} from '../../../../../../../graphql/generated.engine';
import { ToasterService } from '../../../../../../common/services/toaster.service';
import { AddFeaturedEntityModalLazyService } from './add-user-modal/add-featured-entity-modal-lazy.service';
import { NetworkAdminConsoleFeaturedComponent } from './featured.component';
import { MockComponent, MockService } from '../../../../../../utils/mock';
import { MindsGroup, MindsUser } from '../../../../../../interfaces/entities';
import { AddFeaturedEntityModalEntityType } from './add-user-modal/add-featured-entity-modal.types';

describe('NetworkAdminConsoleFeaturedComponent', () => {
  let comp: NetworkAdminConsoleFeaturedComponent;
  let fixture: ComponentFixture<NetworkAdminConsoleFeaturedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        NetworkAdminConsoleFeaturedComponent,
        MockComponent({ selector: 'm-button' }),
      ],
      providers: [
        {
          provide: GetFeaturedEntitiesGQL,
          useValue: jasmine.createSpyObj('GetFeaturedEntitiesGQL', ['watch']),
        },
        {
          provide: StoreFeaturedEntityGQL,
          useValue: jasmine.createSpyObj('StoreFeaturedEntityGQL', ['mutate']),
        },
        {
          provide: ToasterService,
          useValue: MockService(ToasterService),
        },
        {
          provide: AddFeaturedEntityModalLazyService,
          useValue: MockService(AddFeaturedEntityModalLazyService, {
            has: ['entity$'],
            props: {
              entity$: {
                get: () => new Subject<MindsUser | MindsGroup>(),
              },
            },
          }),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NetworkAdminConsoleFeaturedComponent);
    comp = fixture.componentInstance;

    (comp as any).getFeaturedEntitiesGQL.watch.calls.reset();
    (comp as any).storeFeaturedEntityGQL.mutate.calls.reset();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set up query and subscriptions', () => {
      const queryResult = {
        loading: false,
        data: {
          featuredEntities: {
            edges: [],
            pageInfo: {
              hasNextPage: false,
              endCursor: null,
            },
          },
        },
      };

      (comp as any).getFeaturedEntitiesGQL.watch.and.returnValue({
        valueChanges: new BehaviorSubject(queryResult),
      });

      comp.ngOnInit();

      expect((comp as any).getFeaturedEntitiesGQL.watch).toHaveBeenCalledWith(
        {
          first: comp['limit'],
          after: 0,
          type: comp.type$.getValue(),
        },
        {
          fetchPolicy: 'cache-and-network',
          nextFetchPolicy: 'cache-first',
          notifyOnNetworkStatusChange: false,
          errorPolicy: 'all',
          useInitialLoading: true,
        }
      );
      expect(
        (comp as any).featuredEntitiesValueChangeSubscription
      ).toBeDefined();
      expect((comp as any).entityAddedSubscription).toBeDefined();
    });
  });

  describe('fetchMore', () => {
    it('should fetch more entities', () => {
      (comp as any).inProgress$.next(false);
      (comp as any).getFeaturedEntitiesQuery = jasmine.createSpyObj(
        'QueryRef',
        ['fetchMore']
      );

      (comp as any).fetchMore();

      expect((comp as any).inProgress$.getValue()).toBe(true);
      expect(
        (comp as any).getFeaturedEntitiesQuery.fetchMore
      ).toHaveBeenCalledWith({
        variables: {
          after: (comp as any).endCursor,
        },
      });
    });
  });

  describe('onTabClick', () => {
    it('should switch entity types and refetch entities', () => {
      (comp as any).getFeaturedEntitiesQuery = jasmine.createSpyObj(
        'QueryRef',
        ['refetch']
      );

      (comp as any).inProgress$.next(false);
      (comp as any).type$.next(FeaturedEntityTypeEnum.User);
      (comp as any).featuredEntities$.next([{ entityGuid: '123' }]);

      (comp as any).onTabClick(FeaturedEntityTypeEnum.Group);

      expect((comp as any).inProgress$.getValue()).toBe(true);
      expect((comp as any).type$.getValue()).toBe(FeaturedEntityTypeEnum.Group);
      expect((comp as any).featuredEntities$.getValue()).toEqual([]);
      expect((comp as any).endCursor).toBe(0);
      expect((comp as any).hasNextPage$.getValue()).toBe(true);
      expect(
        (comp as any).getFeaturedEntitiesQuery.refetch
      ).toHaveBeenCalledWith({
        first: (comp as any).limit,
        after: 0,
        type: FeaturedEntityTypeEnum.Group,
      });
    });

    it('should not switch tabs if loading is in progress', () => {
      (comp as any).inProgress$.next(true);
      spyOn(console, 'warn');

      (comp as any).onTabClick(FeaturedEntityTypeEnum.Group);

      expect(console.warn).toHaveBeenCalledWith(
        'Attempted to switch tabs whilst loading is in progress.'
      );
    });
  });

  describe('onRowDeletion', () => {
    it('should remove entity from featuredEntities', () => {
      comp.featuredEntities$.next([
        { entityGuid: '123' } as FeaturedEntity,
        { entityGuid: '456' } as FeaturedEntity,
      ]);

      comp.onRowDeletion('123');

      expect(comp.featuredEntities$.getValue()).toEqual([
        { entityGuid: '456' } as FeaturedEntity,
      ]);
    });
  });

  describe('trackBy', () => {
    it('should get trackBy value', () => {
      const featuredEntity: Partial<FeaturedEntity> = {
        id: '123',
      };
      expect(comp.trackBy(featuredEntity as FeaturedEntity)).toBe('123');
    });
  });

  describe('onAddFeaturedEntityClick', () => {
    it('should open add featured entity modal', () => {
      comp.onAddFeaturedEntityClick();

      expect((comp as any).addFeaturedEntityModal.open).toHaveBeenCalledWith(
        AddFeaturedEntityModalEntityType.User
      );
    });
  });

  describe('handleQueryResult', () => {
    it('should update featuredEntities, hasNextPage$, and endCursor', () => {
      const queryResult = {
        data: {
          featuredEntities: {
            edges: [
              { node: { entityGuid: '123' } },
              { node: { entityGuid: '456' } },
            ],
            pageInfo: {
              hasNextPage: true,
              endCursor: '2',
            },
          },
        },
      };

      (comp as any).handleQueryResult(queryResult);

      expect(comp.featuredEntities$.getValue()).toEqual([
        { entityGuid: '123' } as FeaturedEntity,
        { entityGuid: '456' } as FeaturedEntity,
      ]);
      expect(comp.hasNextPage$.getValue()).toBe(true);
      expect((comp as any).endCursor).toBe(2);
    });
  });

  describe('onUserAdd', () => {
    it('should add user to featuredEntities and call storeFeaturedEntityGQL.mutate', fakeAsync(() => {
      comp.featuredEntities$.next([]);
      const user: Partial<MindsUser> = {
        guid: '123',
        username: 'testuser',
        name: 'Test User',
        type: 'user',
      };
      (comp as any).storeFeaturedEntityGQL.mutate.and.returnValue(
        of({ data: {} })
      );

      (comp as any).onUserAdd(user);
      tick();

      expect((comp as any).storeFeaturedEntityGQL.mutate).toHaveBeenCalledWith({
        entityGuid: '123',
        autoSubscribe: true,
      });
    }));

    it('should show error toaster if storeFeaturedEntityGQL.mutate throws an error', fakeAsync(() => {
      const user = {
        guid: '123',
        username: 'testuser',
        name: 'Test User',
        type: 'user',
      };
      (comp as any).storeFeaturedEntityGQL.mutate.and.returnValue(
        throwError(() => new Error('Error'))
      );

      (comp as any).onUserAdd(user);
      tick();

      expect((comp as any).toaster.error).toHaveBeenCalled();
      expect((comp as any).featuredEntities$.getValue()).toEqual([]);
    }));

    it('should show warn toaster if user is already featured', fakeAsync(() => {
      comp.featuredEntities$.next([
        {
          __typename: 'FeaturedUser',
          id: '123',
          entityGuid: '123',
          username: 'testuser',
          name: 'Test User',
          autoSubscribe: true,
          recommended: false,
          tenantId: null,
        } as any,
      ]);
      const user: Partial<MindsUser> = {
        guid: '123',
        username: 'testuser',
        name: 'Test User',
        type: 'user',
      };

      (comp as any).onUserAdd(user);
      tick();

      expect(comp.featuredEntities$.getValue()).toEqual([
        {
          __typename: 'FeaturedUser',
          id: '123',
          entityGuid: '123',
          username: 'testuser',
          name: 'Test User',
          autoSubscribe: true,
          recommended: false,
          tenantId: null,
        } as any,
      ]);
    }));
  });

  describe('onGroupAdd', () => {
    it('should add user to featuredEntities and call storeFeaturedEntityGQL.mutate', fakeAsync(() => {
      comp.featuredEntities$.next([]);
      const group: any = {
        guid: '123',
        name: 'Test Group',
        'members:count': 2,
        type: 'group',
      };
      (comp as any).storeFeaturedEntityGQL.mutate.and.returnValue(
        of({ data: {} })
      );

      (comp as any).onGroupAdd(group);
      tick();

      expect((comp as any).storeFeaturedEntityGQL.mutate).toHaveBeenCalledWith({
        entityGuid: '123',
        autoSubscribe: true,
      });
    }));

    it('should show error toaster if storeFeaturedEntityGQL.mutate throws an error', fakeAsync(() => {
      const group: any = {
        guid: '123',
        name: 'Test Group',
        'members:count': 2,
        type: 'group',
      };
      (comp as any).storeFeaturedEntityGQL.mutate.and.returnValue(
        throwError(() => new Error('Error'))
      );

      (comp as any).onUserAdd(group);
      tick();

      expect((comp as any).toaster.error).toHaveBeenCalled();
      expect((comp as any).featuredEntities$.getValue()).toEqual([]);
    }));

    it('should show warn toaster if group is already featured', fakeAsync(() => {
      const group: any = {
        guid: '123',
        name: 'Test Group',
        'members:count': 2,
        type: 'group',
      };

      comp.featuredEntities$.next([
        {
          __typename: 'FeaturedGroup',
          id: group.guid,
          entityGuid: group.guid,
          name: group.name,
          membersCount: group['members:count'] ?? 0,
          autoSubscribe: true,
          recommended: false,
          tenantId: null,
        } as any,
      ]);

      (comp as any).onGroupAdd(group);
      tick();

      expect(comp.featuredEntities$.getValue()).toEqual([
        {
          __typename: 'FeaturedGroup',
          id: group.guid,
          entityGuid: group.guid,
          name: group.name,
          membersCount: group['members:count'] ?? 0,
          autoSubscribe: true,
          recommended: false,
          tenantId: null,
        } as any,
      ]);
    }));
  });
});
