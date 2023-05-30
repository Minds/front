import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterEvent,
} from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { EventEmitter, Injector, PLATFORM_ID } from '@angular/core';
import {
  GroupsFeedService,
  NewsfeedSubscribedComponent,
} from './subscribed.component';
import {
  LatestFeedService,
  TopFeedService,
  ForYouFeedService,
} from './subscribed.component';
import { NewsfeedService } from '../services/newsfeed.service';
import { ClientMetaService } from '../../../common/services/client-meta.service';
import { FeedsUpdateService } from '../../../common/services/feeds-update.service';
import { ToasterService } from '../../../common/services/toaster.service';
import { Client } from '../../../services/api';
import { Upload } from '../../../services/api';
import { Navigation as NavigationService } from '../../../services/navigation';
import { ContextService } from '../../../services/context.service';
import { FeedAlgorithmHistoryService } from './../services/feed-algorithm-history.service';
import { ChangeDetectorRef } from '@angular/core';
import { DismissalService } from './../../../common/services/dismissal.service';
import { FeedNoticeService } from '../../notices/services/feed-notice.service';
import { PersistentFeedExperimentService } from '../../experiments/sub-services/persistent-feed-experiment.service';
import { Platform } from '@angular/cdk/platform';
import { OnboardingV4Service } from '../../onboarding-v4/onboarding-v4.service';
import { MockComponent, MockDirective, MockService } from '../../../utils/mock';
import { ExperimentsService } from '../../experiments/experiments.service';
import { Session } from '../../../services/session';

describe('NewsfeedSubscribedComponent', () => {
  let component: NewsfeedSubscribedComponent;
  let fixture: ComponentFixture<NewsfeedSubscribedComponent>;

  const mockNavigationEndEvent: NavigationEnd = new NavigationEnd(
    0,
    'http://localhost',
    'http://localhost'
  );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        NewsfeedSubscribedComponent,
        MockComponent({
          selector: 'm-composer',
          inputs: ['activity', 'size'],
        }),
        MockComponent({
          selector: 'm-feedNotice__outlet',
        }),
        MockComponent({
          selector: 'm-newsfeed__tabs',
        }),
        MockComponent({
          selector: 'm-channelRecommendation',
        }),
        MockComponent({
          selector: 'infinite-scroll',
          inputs: ['moreData', 'inProgress', 'ignoreEndTracking', 'endText'],
        }),
        MockDirective({
          selector: 'ng-container',
          inputs: ['m-clientMeta'],
        }),
        MockDirective({
          selector: 'm-clientMeta',
        }),
      ],
      providers: [
        { provide: Client, useValue: MockService(Client) },
        { provide: Upload, useValue: MockService(Upload) },
        {
          provide: NavigationService,
          useValue: MockService(NavigationService),
        },
        {
          provide: Router,
          useValue: MockService(Router, {
            has: ['events'],
            props: {
              events: {
                get: () =>
                  new BehaviorSubject<RouterEvent>(mockNavigationEndEvent),
              },
            },
          }),
        },
        {
          provide: ActivatedRoute,
          useValue: MockService(ActivatedRoute, {
            has: ['params', 'queryParams'],
            props: {
              params: {
                get: () =>
                  new BehaviorSubject<any>({
                    algorithm: 'for-you',
                  }),
              },
              queryParams: { get: () => new BehaviorSubject<any>(null) },
            },
          }),
        },
        {
          provide: FeedAlgorithmHistoryService,
          useValue: MockService(FeedAlgorithmHistoryService),
        },
        { provide: ContextService, useValue: MockService(ContextService) },
        {
          provide: NewsfeedService,
          useValue: MockService(NewsfeedService, {
            has: ['onReloadFeed'],
            props: {
              onReloadFeed: { get: () => new EventEmitter<boolean>() },
            },
          }),
        },
        {
          provide: ClientMetaService,
          useValue: MockService(ClientMetaService),
        },
        {
          provide: FeedsUpdateService,
          useValue: MockService(FeedsUpdateService, {
            has: ['postEmitter'],
            props: {
              postEmitter: { get: () => new EventEmitter<boolean>() },
            },
          }),
        },
        { provide: ToasterService, useValue: MockService(ToasterService) },
        {
          provide: ExperimentsService,
          useValue: MockService(ExperimentsService),
        },
        { provide: Injector, useValue: MockService(Injector) },
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: DismissalService, useValue: MockService(DismissalService) },
        {
          provide: ChangeDetectorRef,
          useValue: MockService(ChangeDetectorRef),
        },
        {
          provide: FeedNoticeService,
          useValue: MockService(FeedNoticeService),
        },
        {
          provide: PersistentFeedExperimentService,
          useValue: MockService(PersistentFeedExperimentService),
        },
        { provide: Platform, useValue: MockService(Platform) },
        {
          provide: OnboardingV4Service,
          useValue: MockService(OnboardingV4Service, {
            has: ['tagsCompleted$'],
            props: {
              tagsCompleted$: { get: () => new Subject<boolean>() },
            },
          }),
        },
        {
          provide: Session,
          useValue: MockService(Session),
        },
      ],
    })
      .overrideProvider(ForYouFeedService, {
        useValue: new (function() {
          this.clear = jasmine.createSpy('clear').and.returnValue(this);
          this.setLimit = jasmine.createSpy('setLimit').and.returnValue(this);
          this.fetch = jasmine.createSpy('fetch').and.returnValue(this);
        })(),
      })
      .overrideProvider(TopFeedService, {
        useValue: new (function() {
          this.clear = jasmine.createSpy('clear').and.returnValue(this);
          this.setLimit = jasmine.createSpy('setLimit').and.returnValue(this);
          this.fetch = jasmine.createSpy('fetch').and.returnValue(this);
        })(),
      })
      .overrideProvider(LatestFeedService, {
        useValue: new (function() {
          this.clear = jasmine.createSpy('clear').and.returnValue(this);
          this.setLimit = jasmine.createSpy('setLimit').and.returnValue(this);
          this.fetch = jasmine.createSpy('fetch').and.returnValue(this);
        })(),
      })
      .overrideProvider(GroupsFeedService, {
        useValue: new (function() {
          this.clear = jasmine.createSpy('clear').and.returnValue(this);
          this.setLimit = jasmine.createSpy('setLimit').and.returnValue(this);
          this.fetch = jasmine.createSpy('fetch').and.returnValue(this);
        })(),
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsfeedSubscribedComponent);
    component = fixture.componentInstance;

    (component as any).algorithm = 'for-you';
    (component as any).router.events.next(mockNavigationEndEvent);
    fixture.detectChanges();
  });

  it('should create and load', () => {
    expect(component).toBeTruthy();
  });

  it('should reload the feed on onboarding tag completed subscription firing', fakeAsync(() => {
    (component as any).feedService.clear.calls.reset();
    (component as any).feedService.setLimit.calls.reset();
    (component as any).feedService.fetch.calls.reset();

    (component as any).algorithm = 'for-you';
    (component as any).onboardingV4Service.tagsCompleted$.next(true);
    tick();

    expect((component as any).feedService.clear).toHaveBeenCalled();
    expect((component as any).feedService.setLimit).toHaveBeenCalledWith(12);
    expect((component as any).feedService.fetch).toHaveBeenCalledWith(true);
  }));
});
