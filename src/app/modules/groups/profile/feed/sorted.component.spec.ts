import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { GroupProfileFeedSortedComponent } from './sorted.component';
import { FeedsService } from '../../../../common/services/feeds.service';
import { feedsServiceMock } from '../../../../../tests/feed-service-mock.spec';
import { GroupsService } from '../../groups.service';
import { MockService } from '../../../../utils/mock';
import { SortedService } from './sorted.service';
import { Session } from '../../../../services/session';
import { sessionMock } from '../../../../../tests/session-mock.spec';
import { ActivatedRoute, Router } from '@angular/router';
import { Client } from '../../../../services/api';
import { ChangeDetectorRef } from '@angular/core';
import { GroupsSearchService } from './search.service';
import { clientMock } from '../../../../../tests/client-mock.spec';
import { BehaviorSubject } from 'rxjs';

describe('GroupProfileFeedSortedComponent', () => {
  let comp: GroupProfileFeedSortedComponent;
  let fixture: ComponentFixture<GroupProfileFeedSortedComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [GroupProfileFeedSortedComponent],
        imports: [RouterTestingModule],
        providers: [
          { provide: GroupsService, useValue: MockService(GroupsService) },
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
        ],
      })
        .overrideComponent(GroupProfileFeedSortedComponent, {
          set: {
            providers: [
              {
                provide: FeedsService,
                useValue: feedsServiceMock,
              },
              {
                provide: SortedService,
                useValue: MockService(SortedService),
              },
            ],
          },
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
});
