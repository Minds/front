import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { GroupProfileFeedSortedComponent } from './sorted.component';
import { FeedsService } from '../../../../common/services/feeds.service';
import { GroupsService } from '../../groups.service';
import { MockComponent, MockService } from '../../../../utils/mock';
import { SortedService } from './sorted.service';
import { Session } from '../../../../services/session';
import { sessionMock } from '../../../../../tests/session-mock.spec';
import { ActivatedRoute, Router } from '@angular/router';
import { Client } from '../../../../services/api';
import { ChangeDetectorRef } from '@angular/core';
import { GroupsSearchService } from './search.service';
import { clientMock } from '../../../../../tests/client-mock.spec';
import { BehaviorSubject, of } from 'rxjs';
import { ToasterService } from '../../../../common/services/toaster.service';
import { FeedsUpdateService } from '../../../../common/services/feeds-update.service';

describe('GroupProfileFeedSortedComponent', () => {
  let comp: GroupProfileFeedSortedComponent;
  let fixture: ComponentFixture<GroupProfileFeedSortedComponent>;

  let feedsServiceMock = {
    canFetchMore: true,
    inProgress: new BehaviorSubject(false),
    offset: new BehaviorSubject<number>(0),
    rawFeed: new BehaviorSubject(Array(25).fill(of({}))),
    feed: new BehaviorSubject(Array(25).fill(of({}))),
    clear() {
      of({ response: false }, { response: false }, { response: true });
    },
    response() {
      return { response: true };
    },
    setEndpoint(str) {
      return this;
    }, //chainable
    setLimit(limit) {
      return this;
    },
    setParams(params) {
      return this;
    },
    setUnseen(params) {
      return this;
    },
    fetch() {
      return this;
    },
    loadMore() {
      return this;
    },
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          GroupProfileFeedSortedComponent,
          MockComponent({
            selector: 'm-composer',
            inputs: ['container'],
            outputs: [],
          }),
          MockComponent({
            selector: 'm-tooltip',
            inputs: ['icon'],
            outputs: [],
          }),
          MockComponent({
            selector: 'm-activity',
            inputs: ['displayOptions', 'entity', 'slot', 'canDelete'],
            outputs: ['deleted'],
          }),
          MockComponent({
            selector: 'm-featured-content',
            inputs: ['slot', 'displayOptions', 'showHeader', 'servedByGuid'],
            outputs: [],
          }),
          MockComponent({
            selector: 'infinite-scroll',
            inputs: ['moreData', 'inProgress'],
            outputs: ['load'],
          }),
          MockComponent({
            selector: 'm-groups__kick-modal',
            inputs: ['user', 'group'],
            outputs: ['closed'],
          }),
          MockComponent({
            selector: 'm-sort-selector',
            inputs: [
              'allowedAlgorithms',
              'allowedPeriods',
              'allowedCustomTypes',
              'customType',
              'v2',
            ],
            outputs: ['onChange'],
          }),
        ],
        imports: [RouterTestingModule],
        providers: [
          {
            provide: GroupsService,
            useValue: MockService(GroupsService),
          },
          { provide: Session, useValue: sessionMock },
          { provide: Router, useValue: MockService(Router) },
          { provide: ActivatedRoute, useValue: MockService(ActivatedRoute) },
          { provide: Client, useValue: clientMock },
          {
            provide: ChangeDetectorRef,
            useValue: MockService(ChangeDetectorRef),
          },
          {
            provide: GroupsSearchService,
            useValue: MockService(GroupsSearchService, {
              has: ['query$'],
              props: {
                query$: { get: () => new BehaviorSubject<string>('') },
              },
            }),
          },
          {
            provide: FeedsUpdateService,
            useValue: MockService(FeedsUpdateService, {
              has: ['postEmitter'],
              props: {
                postEmitter: { get: () => new BehaviorSubject<any>(null) },
              },
            }),
          },
          {
            provide: ToasterService,
            useValue: MockService(ToasterService),
          },
        ],
      })
        .overrideProvider(FeedsService, {
          useValue: feedsServiceMock,
        })
        .overrideProvider(SortedService, {
          useValue: MockService(SortedService),
        })
        .compileComponents();
    })
  );

  beforeEach(done => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 2;
    fixture = TestBed.createComponent(GroupProfileFeedSortedComponent);
    comp = fixture.componentInstance;

    comp.group = {
      'is:member': true,
    };

    feedsServiceMock.feed = new BehaviorSubject<any>([
      Promise.resolve([
        {
          dontPin: true,
        },
        {
          dontPin: true,
        },
      ]),
    ]);

    (feedsServiceMock.rawFeed = new BehaviorSubject(Array(25).fill(of({})))),
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

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('should only call the endpoint to load once when no query is set', () => {
    spyOn(comp.feedsService, 'fetch');
    comp.ngOnInit();
    expect(comp.feedsService.fetch).toHaveBeenCalledTimes(1);
  });

  it('should only call the endpoint to load once when a query is set', () => {
    spyOn(comp.feedsService, 'fetch');
    comp.query = '123';
    comp.ngOnInit();
    expect(comp.feedsService.fetch).toHaveBeenCalledTimes(1);
  });

  it('should prepend an activity on activity feed', () => {
    const activity = {
      guid: 123,
      urn: 'urn:activity:123',
      container_guid: 234,
    };
    comp.type === 'activities';
    comp.group = {
      guid: 234,
      moderated: false,
      'is:moderator': false,
      'is:owner': false,
    };

    comp.prepend(activity);
    const rawFeed = comp.feedsService.rawFeed.getValue();
    expect(rawFeed[0]).toEqual({
      entity: activity,
      urn: activity.urn,
      guid: activity.guid,
    });
    expect((comp as any).toast.success).not.toHaveBeenCalled();
  });

  it('should prepend an activity on activity feed and show toast if group is moderated', () => {
    const activity = {
      guid: 234,
      urn: 'urn:activity:234',
      container_guid: 345,
    };
    comp.type === 'activities';
    comp.group = {
      guid: 345,
      moderated: true,
      'is:moderator': false,
      'is:owner': false,
    };

    comp.prepend(activity);
    const rawFeed = comp.feedsService.rawFeed.getValue();
    expect(rawFeed[0]).toEqual({
      entity: activity,
      urn: activity.urn,
      guid: activity.guid,
    });
    expect((comp as any).toast.success).toHaveBeenCalledWith(
      'Your post is pending approval from the group moderators'
    );
  });

  it('should prepend an activity on activity feed and NOT show toast if moderated group but user is owner', () => {
    const activity = {
      guid: 345,
      urn: 'urn:activity:345',
      container_guid: 456,
    };
    comp.type === 'activities';
    comp.group = {
      guid: 456,
      moderated: true,
      'is:moderator': false,
      'is:owner': true,
    };

    comp.prepend(activity);
    const rawFeed = comp.feedsService.rawFeed.getValue();
    expect(rawFeed[0]).toEqual({
      entity: activity,
      urn: activity.urn,
      guid: activity.guid,
    });
    expect((comp as any).toast.success).not.toHaveBeenCalled();
  });

  it('should prepend an activity on activity feed and NOT show toast if moderated group but user is moderator', () => {
    const activity = {
      guid: 456,
      urn: 'urn:activity:456',
      container_guid: 567,
    };
    comp.type === 'activities';
    comp.group = {
      guid: 567,
      moderated: true,
      'is:moderator': true,
      'is:owner': false,
    };

    comp.prepend(activity);
    const rawFeed = comp.feedsService.rawFeed.getValue();
    expect(rawFeed[0]).toEqual({
      entity: activity,
      urn: activity.urn,
      guid: activity.guid,
    });
    expect((comp as any).toast.success).not.toHaveBeenCalled();
  });
});
